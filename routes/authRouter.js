const express      = require('express');
const passport     = require("passport");
const authRoutes   = express.Router();

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Log in

authRoutes.get("/login", ensureLoggedOut("/"), (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: false,
    passReqToCallback: false
  })
);

//Logout

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
