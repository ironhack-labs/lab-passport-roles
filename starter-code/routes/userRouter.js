const express = require('express');

const userRouter = express.Router();
// Require user model
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const ensureLogin = require('connect-ensure-login');
const User = require('../public/models/user');

const checkTA = checkRoles('ta');
const checkDev = checkRoles('developer');
const checkBoss = checkRoles('boss');

mongoose.connect('mondodb://localhost/Users');

userRouter.get('/', (req, res) => {
  res.redirect('/login');
});

userRouter.get('/login', (req, res) => {
  res.render('user/login', { message: req.flash('error') });
});

userRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/controlPanel',
  failureRedirect: '/',
  failureFlash: true,
  passReqToCallback: true,
}));

userRouter.get('/controlPanel', checkBoss, (req, res) => {
  res.render('user/private/controlPanel', { user : req.user });
});

userRouter.get('/addUser', checkBoss, (req, res) => {
  res.render('user/private/addUser', { user : req.user });
});

userRouter.post('/addUser', (req, res) => {
  const { username, password, rol } = req.body;

  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hash,
    rol,
  });
  newUser.save()
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
    });
});

function checkRoles(rol) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.rol === rol) {
      return next();
    }
    res.redirect('/login');
  };
}

module.exports = userRouter;
