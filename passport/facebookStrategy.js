const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
  // function (accessToken, refreshToken, profile, cb) {
  //   User.findOne({ facebookId: profile.id }, function (err, user) {
  //     return cb(err, user);
  //   });
  // }


  function (token, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          const username = profile.name.givenName + ' ' + profile.name.familyName;
          const password = profile.password;
          const facebookId = profile.id;
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);
          const newUser = new User({
            username,
            password: hashPass,
            role: "STUDENT",
            facebookId: facebookId
          });
          newUser.save(function (err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }

      });
    });
  }));