const express = require("express");
const controller = express.Router();

//Model
const User = require('../models/user');


//password
const bcrypt = require('bcrypt');
const salt = 10;
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');

const checkRoles = (role) => {
    return function(req, res, next){
      if (req.isAuthenticated() && req.user.role === role){
        debug('No Access granted');
        return next();
      }else{
        debug('You have access');
        res.redirect('auth/login');
      }
    };
};

controller.get("/", (req, res, next) => {
  res.render("index");
});

controller.get("/private", checkRoles('Boss'), (req, res, next) => {
  res.render("auth/private");
});

module.exports = controller;
