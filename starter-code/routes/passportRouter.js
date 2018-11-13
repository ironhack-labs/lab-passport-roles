const express = require('express');

const router = express.Router();
// User model
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const User = require("../models/User");

router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('passport/signup', {
        errorMessage: 'The username already exists',
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass,
    });

    newUser.save((err) => {
      res.redirect('/');
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('passport/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false,
    passReqToCallback: false,
  }),
);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '//login',
    failureFlash: false,
    passReqToCallback: false,
  }),
);

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
