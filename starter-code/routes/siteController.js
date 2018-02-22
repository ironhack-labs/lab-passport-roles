const express = require("express");
const siteController = express.Router();

const passport = require("passport");

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

module.exports = siteController;
