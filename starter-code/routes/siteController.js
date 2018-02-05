const express = require("express");
const siteController = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

siteController.get("/login", (req, res, next) => {
  res.render("login", { message: req.flash("error") });
});

siteController.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

siteController.get(
  "/",
  ensureLogin.ensureLoggedIn(),
  checkRoles("BOSS"),
  (req, res, next) => {
    res.render("index");
  }
);

function checkRoles(role) {
  return function(req, res, next) {
    if (req.user.role === role) {
      return next();
    } else {
      res.redirect("login");
    }
  };
}

siteController.get(
  "/newUser",
  ensureLogin.ensureLoggedIn(),
  checkRoles("BOSS"),
  (req, res, next) => {
    res.render("newUser");
  }
);

siteController.post("/newUser", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const surname = req.body.familyName;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("newUser", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("newUser", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save(err => {
      if (err) {
        res.render("newUser", { message: "Something went wrong" });
      } else {
        res.redirect("newUser");
      }
    });
  });
});

module.exports = siteController;
