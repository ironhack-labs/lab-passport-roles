
const express = require("express");
const authRoutes = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    req.flash('error', "Indicate username and password");
    res.redirect("/signup");
    return;
  }

  User.findOne({username:username}, (err, user) => {
    if (user) {
      req.flash('error', "The username already exists");
      res.redirect("/signup");
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        req.flash('error', "Something went wrong");
        res.redirect("/signup");
      } else {
        res.redirect("/");
      }
    });
  });
});

module.exports = authRoutes;
