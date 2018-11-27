const passport = require("passport")
const User = require("../models/User")
const FacebookStrategy = require('passport-facebook')

//facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FID,
      clientSecret: process.env.FSECRET,
      callbackURL: "http://localhost:3000/auth/callback/facebook",
      profileFields: ["picture", "displayName"]
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOne({ facebookId: profile.id }).then(user => {
        if (user) return cb(null, user);
        return User.create({
          username: profile.displayName,
          facebookId: profile.id,
          role:"STUDENT"
        })
          .then(user => cb(null, user))
          .catch(err => cb(err));
      });
    }
  )
);

//local
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = passport