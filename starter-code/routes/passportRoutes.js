const express        = require('express');
const bcrypt         = require('bcrypt');
const path           = require('path');

const bcryptSalt     = 10;
const passportRouter = express.Router();
const bodyParser     = require('body-parser');
const mongoose       = require('mongoose');
const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;

const ensureLogin    = require('connect-ensure-login');
const User           = require('../models/User');


passportRouter.get('/user-actions', ensureLogin.ensureLoggedIn(), (req, res) => {
  const userRole = req.user.role;
  if (userRole === 'Boss' || userRole === 'TA') {
    User.find({})
      .then((users) => {
        res.render('passport/actionsPage', { users, userRole: req.user.role });
      });
  } else {
    res.redirect('/');
  }
});


passportRouter.post('/user-actions', ensureLogin.ensureLoggedIn(), (req, res) => {
  const addUserName    = req.body.newname;
  const deleteUser     = req.body.removename;
  const newRole        = req.body.newRole;
  if (addUserName === '' && deleteUser === '' && newRole === '') {
    res.render('passport/actionsPage', { message : 'INDICATE USERNAME AND PASSWORD' });
    return;
  }
  if (addUserName !== '') {
    User.findOne({ addUserName })
      .then((user) => {
        if (user !== null) {
          res.render('passport/signup', { message : 'This User already exists' });
          return;
        }
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync('ironhack', salt);
        const newUser = new User({
          username : addUserName,
          password : hashPass,
          role     : newRole,
        });
        newUser.save()
          .then((saveUser) => {
            console.log('you added a new user to the database BOSSS', saveUser);
            console.log('entra');
            res.redirect('/user-actions');
          })
          .catch((err) => {
            console.log(err);
            res.render('passport/signup', { message : 'Something went wrong' });
          });
      })
      .catch((error) => {
        next(error);
      });
  }
  if (deleteUser !== '') {
    User.deleteOne({ username: deleteUser })
      .then(() => {
        console.log('youve deleted an employee BITCHHH');
      }).catch((err) => {
        console.log(err);
      });
  }
});


passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});


passportRouter.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role     = req.body.role;
  if (username === '' || password === '') {
    res.render('passport/signup', { message : 'INDICATE USERNAME AND PASSWORD' });
    return;
  }
  User.findOne({ username }).then((user) => {
    if (user !== null) {
      res.render('passport/signup', { message : 'This User already exists' });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password : hashPass,
      role,
    });

    newUser.save((err) => {
      if (err) {
        res.render('passport/signup', { message : 'Something went wrong' });
      } else {
        res.redirect('/');
      }
    });
  })
    .catch((error) => {
      next(error);
    });
});


passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});


passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/user-actions',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,


}));

passportRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = passportRouter;
