const express = require("express");
const router = express.Router();

const LocalStrategy = require("passport-local").Strategy;

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


const checkGuest = checkRoles('DEVELOPER');
const checkEditor = checkRoles('TA');
const checkAdmin = checkRoles('BOSS');



// router.get("/signup", (req, res) => {
//   res.render("signup");
// });

router.get("/login", (req, res, next) => {
  res.render("login", {
    "message": req.flash("error")
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/home", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("home", { user: req.user });
});



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


router.get('/private', checkAdmin, (req, res) => {
  console.log('role', req.user.role)
  res.render('private', {
    user: req.user
  });
});

router.get('/', checkEditor, (req, res) => {
  res.render('index', {
    user: req.user
  });
});

router.get('/users-view', (req, res) => {
  // const thisId = req.user.;
  // User.find()
  // .then(nameUser => {
  //   console.log(req.user.firstName)
    res.render('users-view', req.user)
    // })
    // .catch(error => {
    //   console.log('Error while getting the users from the DB: ', error);

    // })
})


module.exports = router;