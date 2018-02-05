const express = require("express");
const auth = express.Router();
const User = require('../models/User');
const { ensureAuthenticated, checkRoles } = require("../passport/auth-roles");
const passport = require("passport");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

auth.get("/", (req, res, next) => {
  res.render("index");
});

auth.get("/signup", checkRoles("Boss"), (req, res, next) => {
  res.render("auth/signup", { user: req.user });
});

auth.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "") {
    res.render("auth/signup", { message: "Username and Password can't be empty" });
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
      password: hashPass,
      role
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/private");
      }
    });
  });
});

auth.get("/login", (req, res, next) => {
  res.render("auth/login");
});

auth.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }));

module.exports = auth;