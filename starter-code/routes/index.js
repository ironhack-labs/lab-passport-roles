const express = require('express');
const router = express.Router();
const Users = require('../models/User')
const Courses        = require('../models/Course')

const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");


// Checkroles curry function
function checkRoles(roles) {
  return function (req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      res.redirect('/');
    }
  }
}

const checkBoss = checkRoles(["Boss"]);
const checkTA = checkRoles(["TA"])

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* Login page*/
router.get(('/login'), (req, res, next) => {
  res.render('login')
})

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/platform",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.post(('/'), (req, res, next) => {
  //if fields are empty
  if (req.body.username === "" || req.body.password === "") {
    console.log({ alert: "Fields can't be empty" })
  }

  Users
    .findOne({ username: req.body.username })
    .then(userExists => {
      if (userExists) {
        res.json({ alert: "Username already exists" })
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(req.body.password, salt);

        const newUser = new Users({
          username: req.body.username,
          password: hashPass,
          role: req.body.role
        })

        newUser
          .save()
          .then(userCreated => {
            res.json({ alert: "User created sucessfully", userCreated })
          })
          .catch(err => {
            console.log(`Error saving new user in the db: ${err}`)
          })
      }
    })
})





router.get("/platform", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("platform", {
    user: req.user
  });
});

//If boss let access to platform
router.get("/employees", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Users.find()
    .then(allUsers => {
      res.render('employees', { 
        allUsers,  
        user : req.user
      })
    })
})


router.post(('/employees/:id/delete'), ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {
  Users
    .findByIdAndDelete({ _id: req.params.id })
    .then(userDeleted => {
      console.log({ alert: "User has been deleted" }, userDeleted);
      res.redirect('/employees')
    })
})

router.get(('/employees/:id/edit'), ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Users
    .findById({ _id: req.params.id })
    .then(userProfile => {
      res.render('edit', { 
        userProfile,
        user: req.user
      })
    })
})

router.post(('/employees'), ensureLogin.ensureLoggedIn(), (req, res, next) => {
 
  if (req.user.role === "Boss" || req.user.id === req.body.id) {
      Users
      .findByIdAndUpdate({ _id: req.body.id }, req.body)
      .then(userUpdated => {
        console.log({ alert: "User has been updated" }, userUpdated);
        res.redirect('/employees')
      })
      .catch(err => console.log(err) )
  }

})


/* Boss Signup Page */
router.get('/signup', ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {
  res.render('signup');
})


// Courses CRUD
router.get("/courses", checkTA, (req, res)=> {
  Courses.find()
  .then(allCourses =>{
    res.render('courses', {
      allCourses,
      user: req.user,
    })
  })
})


router.get("/courses/new",  ensureLogin.ensureLoggedIn(), checkTA, (req, res)=> {
    res.render('courses/new')
})


router.post("/courses",  ensureLogin.ensureLoggedIn(), checkTA, (req, res) => {
  Courses
  .findOne({title : req.body.title})
  .then(courseExists => {
    if(courseExists) {
      res.json({alert: "This course already exists"})
    }else{
      Courses
      .create(req.body)
      .then(courseCreated=>{
        console.log({alert : "Course created", courseCreated})
        res.redirect('courses')
      })
      .catch(err => console.log(err))
    }
  })
})


router.post(('/courses/:id/delete'), ensureLogin.ensureLoggedIn(), checkTA, (req, res, next) => {
  Courses
    .findByIdAndDelete({ _id: req.params.id })
    .then(courseDeleted => {
      console.log({ alert: "Course has been deleted" }, courseDeleted);
      res.redirect('/courses')
    })
})

router.get(('/courses/:id/edit'),  ensureLogin.ensureLoggedIn(), checkTA,(req, res, next) => {
  Courses
    .findById({ _id: req.params.id })
    .then(courseData => {
      res.render('courses/edit', { 
        courseData,
      })
    })
})


router.post(('/courses/:id/edit'),  ensureLogin.ensureLoggedIn(), checkTA,(req, res, next) => {
  Courses
  .findByIdAndUpdate({ _id: req.body.id }, req.body)
  .then(courseUpdated => {
    console.log({ alert: "Course has been updated" }, courseUpdated);
    res.redirect('/courses')
  })
  .catch(err => console.log(err) )
})




router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});




module.exports = router;
