"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const User = require("../models/user");

// encrypt pw with bcrypt
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// go to login page

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

// login user and check with passport

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/auth/boss-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("boss-page", { user: req.user });
});

module.exports = router;
