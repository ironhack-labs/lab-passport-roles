const express = require("express");
const siteController = express.Router();
const passport      = require("passport");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User       = require("../models/user");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

var checkBoss = checkRoles('Boss')
var checkDeveloper = checkRoles('Developer')
var checkTA = checkRoles('TA')

siteController.get('/', (req, res, next) => {
  res.render('index', {user: req.user});
});

siteController.get('/login', (req, res) => {
  res.render('auth/login', {message: req.flash('error')});
});

siteController.post('/login', passport.authenticate('local', {
  successRedirect : '/',
  failureRedirect : '/login',
  failureFlash: true,
  passReqToCallback: true
}));






module.exports = siteController;