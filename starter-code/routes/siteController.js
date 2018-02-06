const express = require("express");
const siteController = express.Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

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

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

const checkBoss  = checkRoles('Boss');
const checkDev = checkRoles('Developer');
const checkTA  = checkRoles('TA');

siteController.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/private", ensureLogin.ensureLoggedIn(),(req, res, next) => {
  res.render("auth/private", {user: req.user});
});

siteController.get('/editusers', checkBoss, (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) { return next(err);}

    res.render('auth/editusers', {users: users});
  });
});

siteController.post('/editusers/:id/delete', checkBoss, (req, res, next) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, (err, user) => {
    if (err){ return next(err); }
    return res.redirect('/');
  });

});

module.exports = siteController;
