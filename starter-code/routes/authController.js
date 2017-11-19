const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require('passport');
const express = require("express");
const authController = express.Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const checkRoles = require("../middlewares/checkRoles");
const checkBoss = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');

// Login

authController.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("Error logging in") });
});

authController.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// Log out

authController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// Facebook

authController.get("/auth/facebook", passport.authenticate("facebook"));
authController.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/profile",
  failureRedirect: "/"
}));

module.exports = authController;
