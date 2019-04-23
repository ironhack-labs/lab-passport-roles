const passport = require('passport')
const User = require('../models/User')

//LOCAL STRATEGY
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = passport