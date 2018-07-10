const passport = require('passport');
const facebookStrategy = require('passport-facebook').strategy;
const User = require('../models/User');

passport.use(new FacebookStrategy({
    clientID: '202521957127923'
    ,
    clientSecret: '91e099da48d20aa77e036144ada656da',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
    User.create({ username: profile.displayName }, function (err, user) {
      if (err) {return cb(err, user)};
      cb(null,user)
    });
  }
));

passport.serializeUser(function(user,cb) {
    cb(null,user)
})

passport.deserializeUser(function(user,cb) {
    cb(null,user)
})


module.exports = passport;

