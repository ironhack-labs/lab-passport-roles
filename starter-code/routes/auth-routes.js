// routes/auth-routes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

// User model
const User = require("../models/boss.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// router.get("/", (req, res, next) => {
//   res.render("login");
// });

router.get("/login", (req, res, next) => {
  res.render("login", {
    "message": req.flash("error")
  });
});
router.get("/failure", (req, res, next) => {
  res.render("failure");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/options",
  failureRedirect: "/failure",
  failureFlash: true,
  passReqToCallback: true
}));


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", {
    user: req.user
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



module.exports = router;