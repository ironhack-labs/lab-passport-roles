const express = require('express');
const authController = express.Router();
const passport = require('passport');

// User model
const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authController.get('/login', (req, res, next) => {
  res.render('auth/login' ,{ 'message': req.flash('error') });
});

authController.post('/login', passport.authenticate('local', {
  // successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true

}), (req, res) => {
  
  switch (req.user.role) {
    case 'Boss':
        res.redirect('/employees');
      break;
    case 'TA':
        res.redirect('/courses');
      break;
    default: res.redirect('/');
  }
});

module.exports = authController;
