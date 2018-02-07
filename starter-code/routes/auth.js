const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const authRoutes = express.Router();
const passport = require("passport");
const local = require("../passport/local-strategy");


authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {

  const { username, password } = req.body;

  console.log(username);
  if (username === "" || password === "") {
    console.log(username);
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  User.findOne({ username }, "username", (err, user) => {
    console.log(user);
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
    console.log(username);
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });
    console.log(newUser);

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.get("/private", (req, res, next) => {
  res.render("private");
});

authRoutes.post("/login",passport.authenticate("local", {
    successRedirect: "/auth/private",
    failureRedirect: "/auth/login"
  })
);

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
