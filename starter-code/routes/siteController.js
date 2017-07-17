const express = require("express");
const siteController = express.Router();

const User = require('../models/user');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

siteController.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
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

module.exports = siteController;
