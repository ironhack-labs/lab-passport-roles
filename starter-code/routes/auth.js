// routes/auth-routes.js
const express    = require("express");
const passport = require("passport");
const path = require('path');
var debug = require('debug')('passport-demo:'+path.basename(__filename));
const authRoutes = express.Router();

// User model
const User       = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  console.log("Entra en get auth");
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
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

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login",{
    message: req.flash("error")
  });
});


authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  passReqToCallback: true,
  failureFlash: true
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});



module.exports = authRoutes;
