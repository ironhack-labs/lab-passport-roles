const passport = require('passport')
const User = require('../models/User')

//Estrategia para hacer login (email, redes, sociales)
passport.use(User.createStrategy())
//
passport.serializeUser(User.serializeUser())

passport.deserializeUser(User.deserializeUser())

module.exports = passport