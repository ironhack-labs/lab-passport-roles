const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const authRoutes = express.Router();

// Require Helpers
const auth = require('../helpers/auth');

// User Model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcryptSalt = 10;

// SIGN UP //
authRoutes.get('/signup', auth.checkRoles('BOSS', '/login/'), (req, res, next) => {
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;

  if (username === '' || password === '') {
    req.flash('error', 'Indicate username and password');
    res.render('auth/signup');
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', { error: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass,
      name,
    });

    newUser.save((err) => {
      if (err) {
        res.render('auth/signup', { error: `Something went wrong: ${err}` });
      } else {
        console.log(newUser.name);
        req.flash('success', `Welcome to IBI ${newUser.name}`);
        res.redirect('/login');
      }
    });
  });
});

// LOGIN //
authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRoutes.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

// LOG OUT //
authRoutes.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/login');
});

module.exports = authRoutes;
