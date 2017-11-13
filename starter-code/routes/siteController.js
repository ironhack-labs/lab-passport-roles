const express = require("express");
const siteController = express.Router();
const passport = require('passport');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

//Con función 'checkBoss' se queda esperando / Error en el succesRedirect
siteController.post("/", passport.authenticate("local", {
  successRedirect: "/privateBoss",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

// siteController.get('/', checkBoss, (req, res) => {
//   res.render('/privateBoss', {user: req.user});
// });

function checkBoss(role){
  return (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === role) {
      return next();
    } else{
      res.redirect('/');
    }
  }
}

module.exports = siteController;
