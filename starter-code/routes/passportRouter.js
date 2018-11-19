const express = require("express");
const passportRouter = express.Router();
// Require  models
const User = require("../models/user");
const Course = require('../models/Course');
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

const checkBoss = checkRoles("Boss");
const checkDeveloper = checkRoles("Developer");
const checkTA = checkRoles("TA");

passportRouter.get(
  "/passportIndex",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    if (req.user.role === 'Boss') {
      res.redirect('/bossProfile');
    } else  if(req.user.role === 'Developer'){
      res.render('passport/profile', req.user);
    }else{
      res.render('user/viewTa',req.user);
    }
  }
);

passportRouter.get("/bossProfile", (req, res, next) => {



  User.find()
    .then(users => {
      // console.log(users);
      // users.forEach(function(user){
      //   if(user.role === "Boss"){
      //     user.isBoss = true;
      //   }else{
      //     user.isBoss = false;
      //   }
      // })
      // console.log(users);
      res.render("boss/profileBoss", { users });
    })
    .catch(next);
});

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          message: "The username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save(err => {
        if (err) {
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login", { message: req.flash("error") });
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/passportIndex",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

passportRouter.get("/logout", ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/login");
});

passportRouter.get("/passport/:id/edit", (req, res, next) => {
  let userId = req.params.id;

  User.findOne({ _id: userId })
    .then(user => {
      res.render("user/edit", user);
    })
    .catch(next);
});

passportRouter.post("/passport/:id/edit", (req, res, next) => {
  let userId = req.params.id;

  var objUser = {
    username: req.body.username,
    role: req.body.role
  };

  User.findByIdAndUpdate(userId, { $set: objUser }, { new: true })
    .then(() => {
      if(req.user.role === 'Boss'){
        res.redirect("/bossProfile");
      }else{
        res.redirect("/passportIndex");
      }
      
    })
    .catch(next);
});

passportRouter.get("/passport/:id/showProfiles", (req, res, next) => {
  User.find()
    .then(users => {
      console.log(users);
      res.render("user/show", { users });
    })
    .catch(next);
});

passportRouter.post("/passport/:id/deleteUser", (req, res, next) => {
  let userId = req.params.id;

  User.findByIdAndRemove({ _id: userId })
    .then(() => {
      res.redirect("/passportIndex");
    })
    .catch(next);
});

passportRouter.get("/passport/createUser", (req, res, next) => {
  res.render("boss/create");
});

passportRouter.post("/passport/newUser", (req, res, next) => {
  var objUser = {
    username: req.body.username,
    role: req.body.role,
    password: req.body.password
  };

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashedPassword = bcrypt.hashSync(objUser.password, salt);

  const newUser = new User();

  newUser.username = objUser.username;
  newUser.role = objUser.role;
  newUser.password = hashedPassword;

  newUser
    .save()
    .then(() => {
      res.redirect("/bossProfile");
    })
    .catch(() => {
      req.redirect("/bossProfile");
    });
});

passportRouter.get('/passport/createCourse',(req,res,next)=>{
  console.log('holaa')
    res.render('user/createCourse');

})

passportRouter.post('/passport/createCourse',(req,res,next)=>{
  var objCourse = {
    namecourse: req.body.namecourse,
    professor: req.body.professor,
    duration: req.body.duration
  };

  

  const newCourse = new Course();

  newCourse.namecourse = objCourse.namecourse;
  newCourse.professor = objCourse.professor;
  newCourse.duration = objCourse.duration;

  newCourse
    .save()
    .then(() => {
      res.redirect("/passportIndex");
    })
    .catch(() => {
      req.redirect("/passportIndex");
    });
})

passportRouter.get('/passport/vieAllCourse', (req,res,next)=>{
  Course.find()
  .then(courses => {
    console.log(courses);
    res.render("user/showCourses",  {courses});
  })
  .catch(next);
})




function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}

module.exports = passportRouter;
