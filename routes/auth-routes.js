const express = require('express');
const router  = express.Router();
const passport = require("passport");
const mongoose     = require('mongoose');
const User = require("../models/user");
const Course = require("../models/course");
const bcrypt        = require("bcrypt");
const {ensureLoggedIn, ensureLoggedOut} = require("connect-ensure-login");

const bcryptSalt = 10;
// const salt = bcrypt.genSaltSync(bcryptSalt);

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkBoss  = checkRoles('Boss');
const checkTA  = checkRoles('TA');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET delete-employee */
router.get('/delete-employee/:id', checkBoss, (req, res, next) => {
  User.deleteOne( { _id: req.params.id } )
  .then( res.redirect('/edit-employees'))
  .catch(error => { next(error) })
});


router.get('/courses', ensureLoggedIn(), (req, res, next) => {
  Course.find()
  .then( courses => {
    let user = req.user._id
    res.render('courses', { courses });
  })
  .catch(error => { next(error) })
});

router.get('/course/add', checkTA, (req, res, next) => {
  res.render('course-add');
});

router.post('/course/add', (req, res, next) => {
  const { name, desc, courseType } = req.body;
  const newCourse = new Course({ name, desc, courseType });
  newCourse.save()
  .then((course) => {
    res.redirect('/courses')
  })
  .catch((error) => {
    console.log(error)
  })
});

router.get('/delete-course/:id', checkTA, (req, res, next) => {
  Course.deleteOne( { _id: req.params.id } )
  .then( res.redirect('/courses/edit'))
  .catch(error => { next(error) })
});


router.get('/courses/edit', checkTA, (req, res, next) => {
  Course.find()
  .then( courses => {
    let user = req.user._id
    res.render('courses-edit', { courses });
  })
  .catch(error => { next(error) })
});


router.get('/edit-course/:id', checkTA, (req, res, next) => {
  Course.findById({ _id: req.params.id })
  .then((course) => {
    res.render('edit-course', { course })
  })
  .catch((error) => {
    console.log(error)
  })
});

router.post('/edit-course', checkTA, (req, res, next) => {
  let { name, desc, courseType } = req.body;

  Course.findByIdAndUpdate({ _id: req.query.course_id}, {name, desc, courseType })

  .then((course) => {
    res.redirect('/courses/edit')
  })
  .catch((error) => {
    console.log(error)
  })
});



router.post("/edit-employees", checkBoss, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "" ) {
    res.render("edit_employees", { message: "All fields are required" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("edit_employees", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("edit_employees", { message: "Something went wrong" });
      } else {
        res.redirect("/edit-employees");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

router.get('/employees', ensureLoggedIn(), (req, res, next) => {
  User.find()
  .then( users => {
    let user = req.user._id
    res.render('employees', { users, user });
  })
  .catch(error => { next(error) })
});

router.get('/employees/:id', ensureLoggedIn(), (req, res, next) => {
  User.findById ({ _id: req.params.id })
  .then( user => {
    res.render('show', { user });
  })
  .catch(error => { next(error) })
});

router.get('/employees/edit/:id', ensureLoggedIn(), (req, res, next) => {
  User.findById ({ _id: req.params.id })
  .then( user => {
    res.render('edit', { user });
  })
  .catch(error => { next(error) })
});

router.post('/employees/edit/:id', ensureLoggedIn(), (req, res, next) => {
  let { username } = req.body;

  User.findByIdAndUpdate({ _id: req.params.id }, { username })
  .then((user) => {
    res.redirect('/employees')
  })
  .catch((error) => {
    console.log(error)
  })
});


router.post("/edit-employees", checkBoss, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "" ) {
    res.render("edit_employees", { message: "All fields are required" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("edit_employees", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("edit_employees", { message: "Something went wrong" });
      } else {
        res.redirect("/edit-employees");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});


/* GET edit_employees */
router.get('/edit-employees', checkBoss, (req, res, next) => {
  User.find()
  .then( users => {
    res.render('edit_employees', { users });
  })
  .catch(error => { next(error) })
});

router.post("/edit-employees", checkBoss, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "" ) {
    res.render("edit_employees", { message: "All fields are required" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("edit_employees", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("edit_employees", { message: "Something went wrong" });
      } else {
        res.redirect("/edit-employees");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  // failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = router;
