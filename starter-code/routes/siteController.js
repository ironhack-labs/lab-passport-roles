/*jshint esversion: 6*/
const express = require("express");
const siteController = express.Router();

const User       = require("../models/user.js");
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

siteController.get("/", (req, res, next) => {
  res.render("auth/login");
});

siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const familyName = req.body.familyName;
  const role = req.body.role;

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
      password: hashPass,
      name: name,
      familyName: familyName,
      role: role
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
  res.render("auth/login", { "message": req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/profile');
    }
  };
}

siteController.get('/private', checkRoles('Boss'), (req, res) => {
  User.find({}, function(err, data) {
    console.log(data);
    if(err) return err;
      res.render('private', {user: req.user, users: data});
  });
});

siteController.post("/private", (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const familyName = req.body.familyName;
  const role = req.body.role;

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
      password: hashPass,
      name: name,
      familyName: familyName,
      role: role
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/private");
      }
    });
  });
});

siteController.get("/delete/:id/:name", (req, res, next) => {
  User.remove( { _id: req.params.id }, function(err, data) {
    if(err) return err;
      res.redirect("/private");
  });
});

siteController.get('/profile', (req, res) => {
  User.find({}, function(err, data) {
    if(err) return err;
      res.render('profile', {user: req.user, users: data});
  });
});

siteController.get("/profile-edit", (req, res, next) => {
  res.render("profile-edit");
});

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = siteController;
