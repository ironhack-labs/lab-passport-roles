const express = require('express');
const router = express.Router();
const User = require('../models/user');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// check permissions
const checkTA  = checkRoles('TA');
const checkDev = checkRoles('Developer');
const checkBoss  = checkRoles('Boss');

router.get('/signup', checkBoss, (req, res, next) => {
  res.render('auth/signup', {
    message: req.flash('error'),
  });
});

router.post('/signup', (req, res, next) => {
  const {
    username,
    password, role
  } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup');
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        req.flash('error', 'Please login with your username and password');
        res.redirect('/login');
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
        User.create({
            username,
            password: hashPass,
            role
            // role: 'Boss',
          })
          .then(_ => {
            req.flash('error', `Username ${username} successfully created!`);
            res.redirect('/login');
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    message: req.flash('error'),
  });
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/bureau',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/bureau', checkBoss, (req, res, next) => {
  res.render('auth/bureau');
});

router.get('/logout', ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  req.flash('error', 'Successfully logged out');
  res.redirect('/login');
});

// middleware to check permissions

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      req.flash('error', 'You don\'t have permission to access this platform!');
      res.redirect('/login')
    }
  }
}

module.exports = router;