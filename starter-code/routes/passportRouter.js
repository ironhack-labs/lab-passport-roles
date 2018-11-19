const express = require('express');

const passportRouter = express.Router();
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');

const User = require('../models/User');

passportRouter.get('/login', ensureLogin.ensureLoggedOut(), (req, res, next) => res.render('passport/login'));

passportRouter.get('/profile/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.findById(req.params.id)
    .then(myUser => res.render('profile', { myUser }))
    .catch(err => next(err));
});

passportRouter.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

passportRouter.get('/control-panel', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
    .then(users => res.render('control-panel', { users }));
});

passportRouter.get('/users', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
    .then(users => res.render('users', { users }));
});

passportRouter.get('/edit', ensureLogin.ensureLoggedIn(), (req, res, next) => res.render('edit'));


passportRouter.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false,
  passReqToCallback: false,
}));

passportRouter.post('/control-panel', (req, res, next) => {
  User.findByIdAndRemove(req.body.id)
    .then(() => res.redirect('/control-panel'))
    .catch(err => next(err));
});

passportRouter.post('/users', (req, res, next) => {
  User.findById(req.body.id)
    .then(users => res.redirect('/profile', users))
    .catch(err => next(err));
});

passportRouter.post('/edit', (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, { username: req.body.newUser })
    .then(() => res.redirect(`/profile/${req.body.userId}`))
    .catch(err => next(err));
});

module.exports = passportRouter;
