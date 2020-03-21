const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Take little part of the user data within the session, then when user logs in you fetch the session
// from the database, and you fill in the user model where the id was.
passport.serializeUser((user, callback) => {
  callback(null, user._id)
})

passport.deserializeUser((id, callback) => {
  User.findById(id)
  .then(userObj => {
    callback(null, userObj)
  })
  .catch(e => callback(e))
})

passport.use(
  new LocalStrategy((username, password, callback) => {
    User.findOne({ username })
    .then(user => {
      if (!user) {
        return callback(null, false, { message: 'Incorrect Username' })
      }
      bcrypt.compare(password, user.password, (err, same) => {
        if (!same) {
          callback(null, false, { message: 'Password incorrect' })
        } else {
          callback(null, user)
        }
      })
    })
  })
)

module.exports = passport