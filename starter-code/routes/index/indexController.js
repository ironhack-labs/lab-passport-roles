const express = require("express");
const indexController = express.Router();
const passport = require("passport");
const User = require("../../models/users");

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); 
    } else {
      res.redirect('/login')
    }
  }
  
module.exports = indexController;
