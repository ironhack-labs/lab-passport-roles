const express = require("express");
const siteController = express.Router();
const passport = require('passport');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.post("/", passport.authenticate("local" ,{
  successRedirect: "/privateBoss",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get('/privateBoss', (req, res) => {
  console.log(req.user.role);
  if(req.isAuthenticated() && req.user.role === 'Boss') {
    console.log("entra bien");
    res.render('/privateBoss', {user: req.user});
  } else{
    res.redirect('/');
  }
});

module.exports = siteController;
