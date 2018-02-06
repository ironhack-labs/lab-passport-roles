const express = require("express");
const siteController = express.Router();
const User = require("../models/user");
const Course = require("../models/course");
const bcrypt = require("bcrypt");
const passport = require("passport");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");

siteController.get("/", (req, res, next) => {
  res.render("index");
});

//sign up => à modifier pour ajout de nouveaux éléments par le boss // modifier les chemins + nom

siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
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

    newUser.save(err => {
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

siteController.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/"
    // failureFlash: true,
    // passReqToCallback: true
  })
);
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}

siteController.get(
  "/private",
  ensureLogin.ensureLoggedIn(),
  checkRoles("Boss"),
  (req, res) => {
    res.render("auth/private", { user: req.user });
  }
);

siteController.get("/users", (req, res, next) => {
  const userId = req.query.id;

  User.findById(userId, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render("users", { user: user });
  });
});

siteController.get("/:id/delete", (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndRemove(id, (err, user) => {
    if (err) {
      return next(err);
    }
    return res.redirect("users");
  });
});

module.exports = siteController;
