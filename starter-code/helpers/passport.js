let User = require('../models/User')
let passport = require('passport')
let FacebookStrategy = require('passport-facebook').Strategy;

passport.use(User.createStrategy())

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
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