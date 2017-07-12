const express = require("express");
const siteController = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const bcryptSalt = 10;

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("login");
});

siteController.get("/profiles", (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) { return next(err) }
    res.render('profiles', {users, data: req.user});
  });
});

siteController.get("/profile/:id", (req, res, next) => {

  if (req.isAuthenticated()) {
    User.findById(req.params.id, (err, data) => {
      if (err) {
        return next(err);
      };
      res.render('profile', { data });
    });
  } else {
    res.redirect('/login');
  }

});

siteController.get("/newuser", checkRoles('BOSS'), (req, res, next) => {
  res.render('newuser');
});

siteController.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

siteController.post("/newuser", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "") {
    res.render("/newuser", {
      errorMessage: "Fill all fields to sign up."
    });
    return;
  }

  User.findOne({ "username": username }, //search condition
  "username", //projection!
  (err, user) => {
    if (user !== null) {
      res.render("/newuser", {
        errorMessage: "The username already exists"
      });
      return;
    }
  });

  const salt     = await bcrypt.genSalt(bcryptSalt);
  const hashPass = await bcrypt.hash(password, salt);

  const newUser  = User({
    username,
    password: hashPass,
    role
  });

  newUser.save((err) => {
    if (err) {
      res.render("/newuser", {
        errorMessage: "Something went wrong"
      });
  } else {
    res.redirect("/");
    }
  });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  passReqToCallback: true
}));

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = siteController;
