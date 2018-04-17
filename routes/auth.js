const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const flash = require("connect-flash");


//Mostrar pagina log-in
router.get("/login", (req, res) => res.render("passport/login", {error: req.flash}));


//POST log-in
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: false,
  })
);


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router