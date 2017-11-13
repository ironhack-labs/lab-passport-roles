const express = require("express");
const siteController = express.Router();
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user")

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/private-page", (req, res) => {
  res.render("auth/private", { user: req.user });
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
