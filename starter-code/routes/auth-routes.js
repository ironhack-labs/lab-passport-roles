const passport = require('passport');

const express = require('express');

const ensureLogin = require('connect-ensure-login');

const router = express.Router();

const bcrypt = require('bcrypt');

const saltRounds = 10;

const User = require('../models/User');


router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/user-management', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('private/user-management', { user: req.user });
});

router.post('/create', async (req, res, next) => {
  const { name, username, password, role } = req.body;

  if (username === '' || password === '' || name === '' || role === '') {
    res.render('private/user-management', { message: 'Indicate all fields' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('private/user-management', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        name,
        role,
        password: hashPass,
      });

      newUser.save((err) => {
        if (err) {
          res.render('private/user-management', { message: 'Something went wrong' });
        } else {
          res.redirect('/show-users');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
