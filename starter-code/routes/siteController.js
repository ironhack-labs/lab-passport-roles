const express = require("express");
const siteController = express.Router();
const User           = require("../models/user");

siteController.get("/", (req, res, next) => {
  res.render("index");
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
};

var checkBoss  = checkRoles('BOSS');
var checkDeveloper = checkRoles('DEVELOPER');
var checkTA  = checkRoles('TA');


siteController.get('/private', checkBoss, (req, res) => {
  res.render('passport/private', {user: req.user});
});

// 
// siteController.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });


module.exports = siteController;
