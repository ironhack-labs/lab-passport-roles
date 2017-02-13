/*jshint esversion:6 */
const express = require("express");
const siteController = express.Router();
const mongoose = require('mongoose');
const flash = require('connect-flash');

// User model
const User = require("../models/user");
const Employer = require("../models/employer");
const Course = require("../models/course");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

//Roles
const checkBoss = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("passport/login", {
    "message": req.flash("error")
  });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

siteController.get("/private-page", checkBoss, (req, res) => {
  let user = req.user;
  if (req.user) {
    res.render("passport/private", {
      user
    });
  } else {
    res.redirect("/login");
  }
});

siteController.post("/private-page", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

///FALTA ORGANIZAR REDIRECCIONAMIENTOS Y ESTRUCTURAR LAS VISTAS DE OTRA MANERA!
siteController.post('/private-page', (req, res, next) => {
  const newEmployer = new Employer({
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    password: req.body.password,
    owner: req.user._id, // <-- we add the user ID
    role: req.body.role,
  });

  newEmployer.save((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect('/private-page');
    }
  });
});

///FALTA ORGANIZAR REDIRECCIONAMIENTOS Y ESTRUCTURAR LAS VISTAS DE OTRA MANERA!
siteController.get('/private-page', (req, res, next) => {
  Emoployer.find({
    owner: req.user._id
  }, (err, employer) => {
    if (err) {
      return next(err);
    }
    res.render('/private-page', {
      employer
    });
  });

});

module.exports = siteController;
