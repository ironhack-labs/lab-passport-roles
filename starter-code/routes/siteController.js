const express = require("express");
const siteController = express.Router();
const passport = require('passport');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.post("/", passport.authenticate("local" ,{
  successRedirect: "/private",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get('/private', (req, res) => {
  console.log(req.user.role);
  if(req.isAuthenticated() && req.user.role === 'Boss') {
    res.render('/auth/privateboss', {user: req.user});//Esta ruta me está dando problemas y no sé por qué
  } else{
    res.redirect('/');
  }
});

module.exports = siteController;
