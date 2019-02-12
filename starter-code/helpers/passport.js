const passport = require('passport')
const User     = require('../models/User')
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(User.createStrategy())
passport.use(new FacebookStrategy({
  clientID: "203284823925717",
  clientSecret: "bd59c50c8198eaf94079103c108d216c",
  callbackURL: "http://localhost:3000/facebook/callback",
  profileFields: ['email', 'displayName', 'picture']

}, (accessToken, refreshToken, profile, cb) => {
  const {email} = profile._json
  User.findOne({email})
  .then(user => {
    if (!user) {
     return User.register({ name: profile.displayName, email: profile._json.email, picture: profile.photos[0].value }, "PASSWORD")
    }
    cb(null, user)
  })
  .then(user => {
    cb(null, user)
  })
  .catch(err => {
    cb(err)
  })
}
))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = passport