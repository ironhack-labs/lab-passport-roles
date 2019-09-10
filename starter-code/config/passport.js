const passport = require('passport')
const User = require('../models/User')
//tres lineas para configrar passport. son posibles por passport local mongoose
passport.use(User.createStrategy()) //la manera por la que hace el login . Ejemplo: email, redes, etc etc 
passport.serializeUser(User.serializeUser()) //esta guardando la seion del usuario
passport.deserializeUser(User.deserializeUser()) //el objeto del usuario lo va a agregar a req.user

module.exports = passport