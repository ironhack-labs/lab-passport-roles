const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
// const employee      = require("employee");


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('entra');
    return next();
  } else {
    res.redirect('/passport/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/passport/login')
    }
  }
}

router.get('/boss-page', ensureAuthenticated, (req, res) => {
  User.find()
    .then(user => {
      res.render('passport/bossPage', {user});
    })
    .catch(error => {
      console.log(error)
    })
});

module.exports = router;