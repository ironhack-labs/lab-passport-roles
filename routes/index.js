const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const { ensureLoggedIn } = require("connect-ensure-login");
const passport = require("passport");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    //failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/login-boss", (req, res, next) => {
  res.render("auth/login-boss");
});

//Middleware CheckRoles
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/login-boss");
    }
  };
}

router.get("/boss-page", checkRoles("Boss"), (req, res, next) => {
  res.render("boss-page");
});

router.post(
  "/login-boss",
  passport.authenticate("local", {
    successRedirect: "boss-page",
    failureRedirect: "login-boss",
    //failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = router;
