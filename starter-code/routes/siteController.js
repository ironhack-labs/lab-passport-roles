const express = require("express");
const siteController = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcryptjs = require("bcryptjs");
const bcryptSalt = 14;
const checkRoles = require("../middlewares/checkRoles");
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

siteController.get("/", checkRoles("Boss"), (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res) => {
  res.render("passport/login", { user: req.user });
});

siteController.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = siteController;
