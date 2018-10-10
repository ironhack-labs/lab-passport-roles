const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport')


//LOGIN
router.get('/login', (req, res) => {
  res.render("login")
});

// TRAER DATOS DEL LOGIN
// passport.authenticate("local") --> es un MIDDELWARE que se encarga de buscar el nombre de usuario de la bd, hashea 
// y ve si es la contraseña correcta..."local" es la estrategia y puede ser facebook
router.post('/login', passport.authenticate("local"), (req, res) => {
 res.redirect("/boss")
});


//LOGOUT
router.post('/logout', (req, res) => {
  req.logOut();
  res.redirect("/auth/login")
});

module.exports = router;