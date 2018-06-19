// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();
const passport = require('passport');

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function checkRole(req, res, next) {
  console.log(req.user);
  if (req.user.role === "Boss")
    return next();
  else  
    res.redirect("/");
}

authRoutes.get("/login", (req, res, next) => {
  res.render("login");
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  //failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/boss-page", checkRole, (req, res, next) => {
  res.render("boss-page");
});

module.exports = authRoutes;