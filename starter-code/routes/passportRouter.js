const express = require('express');

const passportRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');

const User = require('../models/User');

passportRouter.get('/login', (req, res, next) => res.render('passport/login'));

passportRouter.get('/profile', ensureLogin.ensureLoggedIn(), (req, res, next) => res.render('profile'));

passportRouter.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

passportRouter.get('/control-panel', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
    .then(users => res.render('control-panel', { users }));
});

passportRouter.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false,
  passReqToCallback: false,
}));

module.exports = passportRouter;
