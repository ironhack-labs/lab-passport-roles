const User = require('../models/User');
const passport = require("passport");


function ensureAuthenticated(req, res, next) {
  console.log("checking auth")
  if (req.user) {
    next();
  } else {
    res.redirect('/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    console.log(role)
    console.log(req.user)
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = { ensureAuthenticated, checkRoles}