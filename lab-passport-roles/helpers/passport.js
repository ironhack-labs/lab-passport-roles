// Requires the model with passport-local-mongoose plugged in
const User = require('../models/User');
const passport = require('passport');
const { Strategy: facebookStrategy } = require('passport-facebook');

// Define passport usage with local strategy
passport.use(User.createStrategy());

// Define passport usage with Facebook strategy
passport.use( new facebookStrategy(
  {
    clientID: process.env.FBID,
    clientSecret: process.env.FBSECRET,
    callbackURL: 'http://localhost:3000/facebook/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile);

    User.findOne({ facebookId: profile.id })
    .then( user => {
      
      if ( user ) return cb(null, user);

      const { id, displayName } = profile;

      User.create({ facebookId: id, displayName })
      .then( user => cb(null, user) )
      .catch( error => cb(error) );

    })
    .catch( error => cb(error) );
  }
));

// use static serialize and deserialize of model for passport session support
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
  .then( user => {
    cb(null, user);
  })
  .catch( error => cb(error) );
});

module.exports = passport;