const express = require("express");
const siteController = express.Router();
const User       = require("../models/user");
// const flash = require("connect-flash")

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;



// Private Pages
const ensureLogin = require("connect-ensure-login");

const passport      = require("passport");

const LocalStrategy = require("passport-local").Strategy;

//First Index Route
siteController.get("/", (req, res, next) => {
  // Point it to your "views/passport/signup.ejs"
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("private-page"
  , { "message": req.flash("error") });
});



siteController.post("/", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));







module.exports = siteController;