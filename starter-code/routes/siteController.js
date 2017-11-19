const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');
const siteController = express.Router();
const debug = require('debug')('ibi-ironhack:' + path.basename(__filename));

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/error');
    }
  };
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  };
}

// ROUTES

siteController.get('/', (req, res) => {
  res.render('index', {user: req.user});
});

siteController.get('/login', (req, res) => {
  res.render('login', {user: req.user});
});

siteController.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);

siteController.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = siteController;
