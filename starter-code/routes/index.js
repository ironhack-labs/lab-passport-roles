const express = require('express');
const router  = express.Router();
// const User = require('../models/User');
const passport = require('passport');
// const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index'/* ,{ "message": req.flash("error") } */)
});

router.post("/", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/private', checkRoles('BOSS'), (req, res) => {
  res.render('private', {user: req.user});
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}











module.exports = router;

