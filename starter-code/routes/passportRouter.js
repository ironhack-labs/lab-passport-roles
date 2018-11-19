const express = require("express");
const passportRouter = express.Router();
const session = require("express-session");
const bodyParser = require("body-parser");


const User = require("../models/Users");


const passport = require("passport");


const ensureLogin = require("connect-ensure-login");



passportRouter.get(
  "/",
  (req, res) => {
    res.render("index", { "message": req.flash("error") });
  }
);

passportRouter.post(
  "/", passport.authenticate('local', {
    successRedirect: '/boss',
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
