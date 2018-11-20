const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/User');
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport 
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

passportRouter.get('/login', (req, res) => {
  res.render('auth/login', {message: req.flash('error')});
});

passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/', 
  failureRedirect: '/login', 
  failureFlash: true, 
  passReqToCallback: true
}));

passportRouter.get('/logout', ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = passportRouter;