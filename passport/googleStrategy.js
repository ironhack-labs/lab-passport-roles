const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google').Strategy;

passport.use(new GoogleStrategy({
  returnURL: 'http://localhost:3000/auth/google/return',
  realm: 'http://localhost:3000/'
},
  function (identifier, done) {
    User.findByOpenID({ openId: identifier }, function (err, user) {
      return done(err, user);
    });
  }
));