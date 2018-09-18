const express = require("express");
const passportRouter = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const checkBoss = checkRoles("Boss");
const checkDeveloper = checkRoles("Developer");
const checkTA = checkRoles("TA");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role.includes(role)) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}
passportRouter.get(
  "/employees",
  [ensureLogin.ensureLoggedIn(), checkBoss],
  (req, res) => {
    User.find().then(users => {
        res.render("employees", { user: req.user, users});
    })
    
  }
);

// LOG IN
passportRouter.get("/login", (req, res, next) => {
  res.render("login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = passportRouter;
