const passport = require('passport');
const User = require('../models/User');

//Se crea una estrategia, sirve para
//estos métodos sólo sirven por passport-local-mongoose

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

module.exports = passport;
