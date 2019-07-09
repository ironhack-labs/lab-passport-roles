const express = require('express');
const authRouter = express.Router();
const User = require('../models/users');
const passport = require('passport');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const ensureLogin = require('connect-ensure-login');

const checkRoles = (role) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == role) {
      next();
    } else {
      res.redirect('login');
    }
  };
};

const isBoss = checkRoles('BOSS');
const isDev = checkRoles('DEVELOPER');

/* GET dashboard page */
authRouter.get('/dashboard', (req, res, next) => {
  User.find()
    .then((user) => {
      res.render('auth/dashboard', {user});
    })
    .catch(err => console.log(err));
});

/* GET signup page */
authRouter.get('/signup', isBoss, (req, res, next) => {
  User.find()
    .then((user) => {
      res.render('auth/signup', {user});
    })
    .catch(err => console.log(err));
});

authRouter.post('/signup', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const { username, password, role } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
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
          res.render('auth/signup', { message: 'Something went wrong' });
        } else {
          res.redirect('/auth/signup');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});


/* GET login page */
authRouter.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/auth/dashboard',
  failureRedirect: '/auth/login',
  /* failureFlash: true, */
  passReqToCallback: true,
}));

module.exports = authRouter;
