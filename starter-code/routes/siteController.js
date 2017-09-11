const express = require("express");
const siteController = express.Router();
const Course = require("../models/Course");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');
const debug = require('debug')("app:auth:local");

const checkBoss = checkRoles('BOSS');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("login", {
    message: req.flash("error")
  });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get('/private', checkBoss, (req, res) => {
  User.find({}).exec(function(err, users) {
    if (err) throw err;
    res.render('private', {
      users: users
    });
  });
});


siteController.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});


function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/');
    }
  };
}

module.exports = siteController;
