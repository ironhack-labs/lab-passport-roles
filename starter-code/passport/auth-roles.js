const User = require('../models/User');
const passport = require("passport");

function ensureAuthenticated(req, res, next) {
  if (req.user) { // true
    return next();
  } else {
    res.redirect('/login')
  }
}


function checkRoles(role) {
  return function(req, res, next) {
    if (req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = { ensureAuthenticated, checkRoles }
