const express = require("express");
const siteController = express.Router();

const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");


siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//Post route to receive the date from the signup form and save the user
siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("auth/signup", { errorMessage: "Indicate a username and a password to sign up" });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { errorMessage: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { errorMessage: "Something went wrong when signing up" });
      } else {
        res.redirect("/");
      }
    });
  });
});


//LOGIN
siteController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

const checkBoss  = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTa  = checkRoles('TA');

siteController.get("/private-page", ensureLogin.ensureLoggedIn(), checkBoss, (req, res) => {
  res.render("auth/private", { user: req.user });
});

siteController.get("/developer", ensureLogin.ensureLoggedIn(), checkDeveloper, (req, res) => {
  res.render("auth/developer", { user: req.user });
});

siteController.get("/ta", ensureLogin.ensureLoggedIn(), checkTa, (req, res) => {
  res.render("auth/ta", { user: req.user });
});


function checkRoles(role) {
  return function(req, res, next) {
    console.log(req.user)
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else if(req.isAuthenticated() && req.user.role === 'Developer') {
      res.redirect('/developer')
    } else if (req.isAuthenticated() && req.user.role === 'TA') {
      res.redirect('/ta')
    } else {
      res.redirect('/login')
    }
  }
}

siteController.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = siteController;
