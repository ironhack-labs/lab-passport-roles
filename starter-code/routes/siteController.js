const express = require("express");
const siteController = express.Router();
const admin = require("./admin");


// Passport middleware used for login
const ensureLogin   = require("connect-ensure-login");
const passport      = require("passport");


siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("login");
});

siteController.post("/login", passport.authenticate('local', {
  successRedirect: "/admin-panel",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect("/login");
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.user.role === role) {
      return next();
    } else {
      res.redirect("/login");
    }
  }
}

siteController.use("/admin-panel", ensureAuthenticated, checkRoles('Boss'), admin);


module.exports = siteController;
