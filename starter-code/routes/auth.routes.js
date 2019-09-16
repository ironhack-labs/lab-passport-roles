const express = require('express');
const brcypt = require('bcrypt');
const User = require('../models/User');
const secure = require('../middlewares/secure.mid');
const passport = require('passport');
const router = express.Router();
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;

  if (username==='' || password==='') {
    res.render('auth/signup', { message: 'Please indicate a username and password' });
  }

  username.findOne({ username })
  .then((user) => {
    if (user) {
      res.render('auth/signup', { message: 'Username already exsits' });
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
    });

    newUser.save()
    .then(() => res.redirect('/'))
    .catch(error => next(error));
  })
  .catch(error => next(error));
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

console.log('aaaaaaaaaa');

router.post('/login', passport.authenticate ('local-auth', {
  successRedirect: '/',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}));

router.get('/private', secure.checkLogin, (req, res, next) => {
  res.render('auth/private', { user: res.user });
});

router.get('/private', secure.checkLogin, (req, res, next) => {
  res.render('auth/private', { user: req.user });
});

router.get('/admin', secure.checkRole('BOSS'), (req, res, next) => {
  res.render('auth/admin', { user: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;