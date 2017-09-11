const express = require("express");
const siteController = express.Router();
const check = require("../middlewares/check")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const passport = require('passport');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.post("/", passport.authenticate("local", {
  successRedirect: "/personal",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/personal", check.ensureAuthenticated(), (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) { return next(err) }
    res.render("user/personal", { users: users, userSession: req.user })
  })
})

module.exports = siteController;
