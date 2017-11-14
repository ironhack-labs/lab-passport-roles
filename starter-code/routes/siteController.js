const express = require("express");
const siteController = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

siteController.get("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/portal');
  } else {
    res.render("index");
  }
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/portal",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});


siteController.get("/auth/facebook", passport.authenticate("facebook"));
siteController.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/portal",
  failureRedirect: "/"
}));
module.exports = siteController;
