const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkTA = checkRoles('TA');
const checkDeveloper = checkRoles('Developer');
const checkBoss = checkRoles('Boss');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/newUser', checkBoss, (req, res, next) => {
  res.render('newUser');
});

router.post('/newUser', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === '' || password === '') {
    res.render('newUser', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('newUser', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      newUser.save((err) => {
        if (err) {
          res.render('newUser', { message: 'Something went wrong' });
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/users', (req, res, next) => {
  User.find()
    .then((user) => {
      res.render('users', { user });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/detail/:id', (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.render('detail', { user });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
