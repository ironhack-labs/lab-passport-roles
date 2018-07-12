const bcrypt         = require("bcrypt");
const express        = require("express");
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const checkBoss      = checkRoles('BOSS');
const checkTa        = checkRoles('TA');
const checkDeveloper = checkRoles('DEVELOPER');

const router         = express.Router();
// User model
const User           = require("../models/user");
const Course         = require("../models/course");
// Bcrypt to encrypt passwords
const bcryptSalt     = 10;

// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  if (req.user.role === "DEVELOPER") {
    res.render("passport/private", { user: req.user });
  } else {
    res.redirect('/login');
  }
});

router.get("/signup", (req, res, next) => {
  if (req.user.role === "BOSS") {
    User.find().then( users =>{
      console.log(users);
      res.render("passport/signup", { users });
    })
  } else {
    res.redirect('/login');
  };
});

router.get("/courses", (req, res, next) => {
  if (req.user.role === "TA") {
    Course.find().then( courses =>{
      console.log(courses);
      res.render("ta/courses", { courses });
    })
  } else {
    res.redirect('/login');
  };
});


router.post("/signup", (req, res, next) => {
  if (req.user.role === "BOSS") {
    const username = req.body.username;
    const password = req.body.password;
    const role     = req.body.role;
    console.log(role);
    if (username === "" || password === "") {
      res.render("passport/signup", { message: "Indicate username and password" });
      return;
    }
    User.findOne({ username }, "username", (err, user) => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
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
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    });
  } else {
    res.redirect('/login');
  };
});

router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/profile", (req, res, next) => {
  console.log(req.user.username);
  res.render('passport/profile');
  // res.render("passport/profile", { user : req.user.username});
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

module.exports = router;
