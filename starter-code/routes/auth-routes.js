const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

const authRoutes = express.Router();

const User = require('../models/user');

const bcryptSalt = 10;

/* ---------- Handle Signup ---------- */

authRoutes.get('/auth/facebook', passport.authenticate('facebook'));

authRoutes.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/private-page',
    failureRedirect: '/'
  })
);

authRoutes.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('private', { user: req.user });
});

module.exports = authRoutes;
