const passport = require('passport')
const User = require ('../models/User')

//LOCAL 
passport.use(User.createStrategy())
passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user)
  })
})

//FACEBOOK LOGIN 

module.exports = passport