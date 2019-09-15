//se puede llamar handlers la carpeta
//todo es para passport 
//passport pide a user y user pide a passport

const passport = require('passport')
const User = require('../models/User')

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = passport
