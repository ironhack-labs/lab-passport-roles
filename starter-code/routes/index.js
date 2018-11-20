const express = require('express');
const router  = express.Router();
const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
//const ensureLogin = require("connect-ensure-login");

//Compruebo los roles
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

router.get('/', (req, res) => {
  res.render('index', {user: req.user});
});

//Doy permiso a la ruta si el rol es ADMIN
router.get('/private', (req, res) => {
  res.render('private-page', {user: req.user});
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

//Restringir con cheroles las páginas de cada usuario. Debo crear las vistas hbs
router.get('/private-dev', checkRoles('TA'), (req, res) => {
  res.render('private', {user: req.user});
});

router.get('/private-dev', checkRoles('Developer'), (req, res) => {
  res.render('private', {user: req.user});
});
module.exports = router;