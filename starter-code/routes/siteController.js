const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require('passport');
const express = require("express");
const siteController = express.Router();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const checkRoles = require("../middlewares/checkRoles");

const checkBoss = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

// Login

siteController.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("Error logging in") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

// Profiles

siteController.get('/profile',(req,res) =>{
  res.redirect('/profile/' + req.user.id)
});

siteController.get("/profile/:id", ensureAuthenticated(), (req, res, next) => {
  User.findById(req.params.id).then(response => {
    User.find({}, (err, users) => {
      if (err) { return next(err) }
      res.render("profile/show", { user:response, users: users, userSession: req.user })
    })
  }).catch( err => next(err))
})

// Allow only the Boss user to add and remove employees to the platform.

siteController.get('/admin/add', checkBoss, (req, res) => {
  res.render('admin/add', { user: req.user });
});

siteController.get('/admin/delete', checkBoss, (req, res) => {
  res.render('admin/delete', { user: req.user });
});

// Log out

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = siteController;
