const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// User model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// signup ---------------------------
authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username }, 'username', (err, user, next) => {
    if (err) {
      return next(err);
    }
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render('auth/signup', { message: 'Something went wrong' });
      } else {
        res.redirect('/login');
      }
    });
  });
});

// login ------------------- with passport
authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRoutes.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login', // adjust
  failureFlash: true,
  passReqToCallback: true
}));

// private page
authRoutes.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('users/private', { user: req.user });
});

// signup with facebook
authRoutes.get('/auth/facebook', passport.authenticate('facebook'));

authRoutes.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}));

module.exports = authRoutes;
