const express = require("express");
const passport = require("passport");
const path = require('path');
const siteController = express.Router();

siteController.get("/login", (req, res, next) => {
  res.render("auth/login", {
    message:  ''   // req.flash("error")
  });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  passReqToCallback: true,
  failureFlash: false
}));


siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = siteController;
