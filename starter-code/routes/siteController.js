const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const checkRoles = require('../middlewares/checkRoles');
const checkBoss  = checkRoles('BOSS');

router.get("/private-page", ensureLogin.ensureLoggedIn(), checkBoss, (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/", (req, res, next) => {
  res.render("index");
});

// HOW TO CHANGE ensure to /login AND NOT passport/login
router.get("/passport/login", (req, res, next) => {
  res.redirect("/login");
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "passport/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
