// jshint esversion:6
const express = require("express");
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");
const bcrypt         = require("bcrypt");
const siteController = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log('no ha entrado');
    res.redirect('/login');
  }
}

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/boss", ensureAuthenticated, (req, res, next) => {
console.log(req.user);
  if(req.user.role === 'Boss'){
    res.render("boss");
  }else{
    res.redirect('/');
  }
});
siteController.get("/login", (req, res, next) => {
  res.render("login");
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/boss",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

module.exports = siteController;
