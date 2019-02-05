const express = require('express');
const router = express.Router();
const modelUser = require('../models/roles')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const salt = 10
const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy
// const ensureLogin = require("connect-ensure-login");
// const flash = require('connect-flash')
const modelCourses = require('../models/courses')


const passportFacebook = require('passport-facebook')
const FacebookStrategy = passportFacebook.Strategy

passport.use(new FacebookStrategy({
  clientID: "324095571558623",
  clientSecret: "fbb8653ae44bc60d489755a8ed809f4f",
  callbackURL: "/return"
},

  function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));


passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


router.use(passport.initialize());
router.use(passport.session());


router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/return', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(res)
    res.render('alumni', { user: req.user });
  });



router.get('/alumni', require('connect-ensure-login').ensureLoggedIn(), (req, res, next) => {

  res.render('alumni')

})

module.exports = router;