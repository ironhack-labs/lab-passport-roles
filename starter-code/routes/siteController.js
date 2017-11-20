const express = require('express');
const siteController = express.Router();
const ensureLogin = require('connect-ensure-login');
const User = require('../models/User');

siteController.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find({role: 'Developer'},(err, users)=> {
    err ? next(err) : res.render('index', {users: users, user : req.user});
  })
});

module.exports = siteController;
