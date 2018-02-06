const express = require("express");
const authRoutes = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport')
const User = require("../models/User");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");


authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login");
  });
  
  authRoutes.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login"
  }));
  
  authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("private", { user: req.user });
  });

  module.exports = authRoutes;