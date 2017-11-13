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

siteController.get("/private-profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  if (req.user.role == "Boss") res.render("private/boss", { user: req.user });
});

siteController.get("/team", ensureLogin.ensureLoggedIn(), (req, res) => {
  if (req.user.role == "Boss") {
    User.find({'role':  {$in: [
        'Developer',
        'TA',
    ]}}, (err, users) => {
      res.render("private/team", { user: req.user, users : users });
    });
  }
});

module.exports = siteController;
