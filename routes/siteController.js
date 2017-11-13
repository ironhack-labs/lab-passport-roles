const express = require("express");
const siteController = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get('/signup', (req, res, next) => {
  res.render("auth/signup")
});

siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
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
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/private-page");
      }
    });
  });
});


// const checkBoss  = checkRoles('Boss');
// const checkDeveloper = checkRoles('Developer');
// const checkTA  = checkRoles('TA');

siteController.get("/private-page", ensureLogin.ensureLoggedIn(), checkRoles('Boss'), (req, res) => {
  res.render("auth/private", { user: req.user });
});
siteController.get("/developer", ensureLogin.ensureLoggedIn(), checkRoles('Developer'), (req, res) => {
  res.render("auth/developer", { user: req.user });
});
siteController.get("/ta", ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res) => {
  res.render("auth/ta", { user: req.user });
});


function checkRoles(role) {
  return function(req, res, next) {
    console.log(req.user)
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else if(req.isAuthenticated() && req.user.role === "Developer") {
      res.redirect('/developer')
    } else if (req.isAuthenticated() && req.user.role === "TA") {
      res.redirect('/ta')
    } else {
      res.redirect('/login')
    }
  }
}




siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});




module.exports = siteController;
