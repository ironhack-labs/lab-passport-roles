const express = require('express');
const router = express.Router();
const User = require('../models/user');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// check permissions
const checkTA = checkRoles('TA');
const checkDev = checkRoles('Developer');
const checkBoss = checkRoles('Boss');

const Course = require('../models/course');

router.get('/signup', checkBoss, (req, res, next) => {
  res.render('auth/signup', {
    message: req.flash('error'),
  });
});

router.post('/signup', (req, res, next) => {
  const {
    username,
    password,
    role
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
        req.flash('error', '');
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
            req.flash('error', '');
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

router.get('/bureau', ensureAuthenticated, (req, res, next) => {
  res.render('auth/bureau', {
    message: req.flash('error')
  });
});

router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash('error', '');
  req.flash('error', 'Successfully logged out');
  res.redirect('/login');
});

router.get('/users', ensureAuthenticated, (req, res, next) => {
  User.find()
  .then(users => {
    res.render('auth/users', {
      message: req.flash('error'), users
    });
  })
  .catch(err => console.log(err));
});

router.post('/edit-user', ensureAuthenticated, (req, res, next) => {
  const { id, username, password, role } = req.body;
  if (username === '' || password === '') {
    res.render('auth/edit');
    return;
  }
  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        req.flash('error', '');
        req.flash('error', 'It\'s not possible to process your request');
        res.redirect('/users');
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
        User.findByIdAndUpdate(id, {
            username,
            password: hashPass,
            role
            // role: 'Boss',
          })
          .then(_ => {
            req.flash('error', '');
            req.flash('error', `Username ${username} successfully updated!`);
            res.redirect('/users');
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

router.get('/users/:id', ensureAuthenticated, (req, res, next) => {
  // console.log(req.params.id);
  User.findById(req.params.id)
  .then(user => {
    res.render('auth/detail-user', user);
  })
  .catch(err=> console.log(err));
});

router.get('/users/:id/edit', ensureAuthenticated, (req, res, next) => {
  // let comparison = (req.user._id == req.params.id);
  if(req.user._id == req.params.id) {
    res.render('auth/edit', req.user);
    // res.send(req.user._id + 'we are in' + req.params.id);
    // res.send(comparison);
  } else {
    req.flash('error', '');
    req.flash('error', 'You don\'t have permission to edit this data!');
    res.redirect('/users');
    // res.send(req.user._id + 'we are not in' + req.params.id);
    // res.send(comparison);
  }
})

//courses routes

router.get('/courses', checkTA, (req, res, next) => {
  Course.find()
  .then(courses => {
    res.render('auth/courses', {{ message: req.flash('error'), courses });
  })
  .catch (err => console.log(err));
});

router.get('/courses/add', checkTA, (req, res, next) => {
  res.render('auth/add-course');
});

router.get('/courses/:id', checkTA, (req, res, next) => {
  res.render('auth/course-detail');
});

router.get('/course/:id/edit', checkTA, (req, res, next) => {
  res.render('auth/edit-course');
});

router.post('/courses/:id/delete', ensureAuthenticated, (req, res, next) => {
  Course.findByIdAndRemove(req.params.id)
  .then(_ => {
    req.flash('error', '');
    req.flash('error', 'Course deleted');
    res.redirect('/courses');
  })
  .catch(err => console.log(err))
});

// middleware to check permissions

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      req.flash('error', '');
      req.flash('error', 'You don\'t have permission to access this page!');
      res.redirect('/bureau')
    }
  }
}

// middleware to check if authenticated

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', '');
    req.flash('error', 'You don\'t have permission to access this page!');
    res.redirect('/login')
  }
}

module.exports = router;