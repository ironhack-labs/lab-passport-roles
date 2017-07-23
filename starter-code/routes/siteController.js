const express = require("express");
const siteController = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const User = require('../models/user');
const Course = require('../models/course');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

siteController.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

siteController.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error")});
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

siteController.get('/bossPage', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('bossPage', {user: req.user});
});

siteController.get('/courses', (req, res, next) => {
  Course.find({}, (err, courses) => {
    if (err) {
      next(err);
    } else {
      res.render('courses/courses', { courses });
    }
  })
})


module.exports = siteController;
