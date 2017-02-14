const express = require("express");
const router = express.Router();
// User model
const User           = require("../model/user");
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



/* GET home page. */

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

var checkBoss  = checkRoles('BOSS');
var checkDev = checkRoles('DEVELOPPER');
var checkTA  = checkRoles('TA');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello' });
});

router.get('/login', (req, res, next) => {
  res.render('passport/login',{ "message": req.flash("error") });
});




router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', {user: req.user});
});


router.get('/posts', checkTA, (req, res) => {
  res.render('passport/private', {user: req.user});
});

module.exports = router;
