const express = require("express");
const siteController = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

siteController.get("/", (req, res, next) => {
  res.render("index");
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

module.exports = siteController;
