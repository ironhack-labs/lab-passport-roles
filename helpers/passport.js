const passport = require('passport');
const User = require('../models/User') //Traemos el modelo

//LO QUE SE NECESITA PARA YA EMPEZA A HACER REGISTR-LOGIN Y LOGOUT
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Exportamos el modulo
module.exports = passport;