const express = require("express");
const passportRouter = express.Router();
const session = require("express-session");
const bodyParser = require("body-parser");

// Require user model
const User = require("../models/Users");

// Add bcrypt to encrypt passwords
// const bcrypt = require("bcrypt");
// const bcryptSalt = 10;

// Add passport
const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");



passportRouter.get(
  "/boss",
  (req, res) => {
    res.render("index", { "message": req.flash("error") });
  }
);

passportRouter.post(
  "/boss", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true,
    passReqToCallback: true,
  })
  
);

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("userBoss/userBoss", { user: req.user });
  }
);



module.exports = passportRouter;
