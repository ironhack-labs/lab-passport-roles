const boss = "Boss";
const dev = "Developer";
const TA = "Teacher Assistant";
var passport = require('passport');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

function checkIfStaff(role){
  return ((role === boss) || (role === dev) || (role === TA));
} 

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/forbidden');
    }
  };
}

function ensureEmployee(req, res, next){
    if (req.isAuthenticated() && checkIfStaff(req.user.role) ) {
      return next();
    } else {
      res.render('site/forbidden');
    }
}

function isLoggedIn(req, res, next){
  res.locals.loggedIn = req.isAuthenticated();
  next();
}

module.exports = {
  checkRoles, ensureEmployee, checkIfStaff, ensureAuthenticated, isLoggedIn
}