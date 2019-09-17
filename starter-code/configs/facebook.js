require('dotenv').config();

const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new FacebookStrategy({
  clientID: `${process.env.FACEBOOK_APP_ID}`,
  clientSecret: `${process.env.FACEBOOK_APP_SECRET}`,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email']
},

(accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookId: profile.id })
    .then((user) => {
      if (user) {
        done(null, user);
        return;
      }

      User.create({ facebookId: profile.id, username: profile.displayName })
        .then((newUser) => {
          done(null, newUser);
        })
        .catch(err => done(err)); // closes User.create()
    })
    .catch(err => done(err)); // closes User.findOne()
},

));