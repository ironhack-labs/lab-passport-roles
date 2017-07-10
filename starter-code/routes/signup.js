const express    = require("express");
const privateRoutes = express.Router();
const passport      = require("passport");
const ensureLogin = require("connect-ensure-login");

// User model
const User       = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

privateRoutes.get("/signup", (req, res, next) => {
  res.render("private/signup");
});

privateRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("private/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("private/signup", { message: "The username already exists" });
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
        res.render("private/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});
privateRoutes.get("/login", (req, res, next) => {
  res.render("private/login");
});

privateRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));
privateRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});
module.exports = privateRoutes;
