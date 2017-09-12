const express = require("express");
const siteController = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("login");
});

siteController.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  if (username === "" || password === "") {
    res.render("login", { message: "Indicate username and password" });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  let Boss = User.findOne({role:'Boss'});
  //Boss = JSON.stringify(Boss);
  console.log(Boss.username,Boss.password );
  if (Boss.username != "username" || Boss.password != "password") {
    res.render("login", { message: "You is not The Boss" });
    return;
  }
  else {
      router.post("/login", passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
      passReqToCallback: true
      }));
  }
});

module.exports = siteController;
