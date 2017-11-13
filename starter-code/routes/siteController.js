const express = require("express");
const siteController = express.Router();
// User model
const User = require("../models/user");
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

siteController.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {

});

// router.get('/private', ensureAuthenticated, (req, res) => {
//   res.render('private', {user: req.user});
// });
//
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.redirect('/login')
//   }
// }

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


siteController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;


  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
         res.render('index')
      }
    });
  });
});

siteController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

siteController.post("/login", passport.authenticate("local"), (req, res) => {
  res.redirect("/private");
});

var checkBoss  = checkRoles('Boss');
var checkTA = checkRoles('TA');
var checkDeveloper  = checkRoles('Developer');

function checkRoles(role) {
  return function(req, res, next) {
    console.log(req.user)
    if (req.isAuthenticated() && req.user.roles === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

siteController.get('/private', checkBoss, (req, res) => {
  res.render('auth/private', {user: req.user});
});



module.exports = siteController;
