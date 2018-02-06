const express = require("express");
const siteController = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport')
const User = require("../models/User");
const bcryptSalt = 10;

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});


siteController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login"
}));

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});





module.exports = siteController;
