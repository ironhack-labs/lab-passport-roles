const passport = require('passport')
const User = require('../models/User')

passport.use(User.createStrategy())

// serialize 
passport.serializeUser(function (user, cb) {
  cb(null, user)
})
//deserialize
passport.deserializeUser(function (user, cb) {
  cb(null, user)
})

module.exports = passport