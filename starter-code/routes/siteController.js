const express = require("express");
const siteController = express.Router();
const User = require('../models/User');
// EnsureLogin for private page.
const ensureLogin = require("connect-ensure-login");

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.redirect("/auth/login");
});

// PRIVATE PROFILES
siteController.get("/private-profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  if (req.user.role == "Boss") res.render("private/boss", { user: req.user });
  if(req.user.role == "Developer" || req.user.role == "TA" ) {
    res.render('private/devta', { user: req.user })
  }
});

// TEAM VIEW
siteController.get("/team", ensureLogin.ensureLoggedIn(), (req, res) => {
  if (req.user.role == "Boss" || req.user.role == "Developer" || req.user.role == "TA") {
    User.find({'role':  {$in: [
        'Developer',
        'TA',
    ]}}, (err, users) => {
      res.render("private/team", { user: req.user, users : users });
    });
  }
});

module.exports = siteController;
