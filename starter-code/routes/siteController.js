const express = require("express");
const siteController = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");



siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/signup", (req, res, next) => {
  res.render("passport/signup", {});
});

siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      name: name,
      familyName: familyName,
      password: hashPass,
      role: 'Developer'
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

siteController.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/account",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

siteController.get("/account", (req, res) => {
  let user = req.user;
  console.log(user);
  res.render("passport/account", user);
});

module.exports = siteController;
