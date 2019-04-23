const passport = require('passport')
const User = require('../models/User')
const FacebookStrategy = require('passport-facebook').Strategy

// LOCAL STRATEGY
passport.use(User.createStrategy())
passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user)
  })
})

// FACEBOOK STRATEGY
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FBID,
      clientSecret: process.env.FBSECRET,
      callbackURL: 'http://localhost:3000/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value })
        .then(doc => {
          if (!doc) {
            User.create({ email: profile.emails[0].value })
              .then(user => {
                cb(null, user)
              })
              .catch(err => {
                cb(err, null)
              })
          } else {
            cb(null, doc)
          }
        })
        .catch(err => {
          cb(err, null)
        })
    }
  )
)

module.exports = passport
