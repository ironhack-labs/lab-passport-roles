// const express = require('express');
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const bcryptSalt = 10;
 const passport = require("passport");
// const ensureLogin = require("connect-ensure-login");
// const User = require("../models/user");

function checkRoles(roles) {
  return function (req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      if (req.isAuthenticated()) {
        res.redirect("/list");
      } else {
        res.redirect("/login");
      }
    }
  };
}

module.exports = checkRoles;