const passport = require('passport');
const User = require('../models/User');
//passport es un framework para hacer login

//este archivo es para crear la estrategia local
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;