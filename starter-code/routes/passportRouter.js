
const express        = require("express");


// Require user model
const User        = require('../models/user')
// Add bcrypt to encrypt passwords
const bcrypt      = require("bcrypt");
const bcryptSalt  = 10;
// Add passport 
const passportRouter = express.Router();

const passport = require("passport");
const ensureLogin = require("connect-ensure-login");





passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;