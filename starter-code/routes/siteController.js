const express = require("express");
const siteController = express.Router();
const passport = require("passport");
const User = require("../models/users");
const ensureLogin = require("connect-ensure-login");

siteController.get("/", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("index/index", { user: req.user });
})

siteController.get("/login", (req, res, next) => {
  res.render("login", { layout: 'layouts/login-layout' ,
                        message: req.flash("error")});
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

siteController.get("/auth/facebook", passport.authenticate("facebook"));
siteController.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/",
  failureRedirect: "/login"
}));

module.exports = siteController;
