const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');
const usersController = express.Router();

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/error');
    }
  };
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  };
}

usersController.get('/employees', checkRoles('Boss'), (req, res) => {
  User.find({$or: [ {role: 'Developer'}, {role: 'TA'} ]})
    .then((data) => {
      res.render('employees', {data: data, user: req.user});
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = usersController;
