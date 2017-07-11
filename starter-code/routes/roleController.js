const mongoose = require('mongoose');
const express = require("express");
const roleController = express.Router();
const User = require('../models/user');
const passport = require("passport");

mongoose.connect("mongodb://localhost/ibi-ironhack").then();

  roleController.get("/login", (req, res) => {
    res.render("passport/login", {});
  });

  roleController.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    passReqToCallback: true,
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

  var checkBoss = checkRoles('Boss');

// boss newuser
  roleController.get('/newuser', checkBoss, (req, res) => {
    res.render('users/new', {});
  });

  roleController.post('/newuser', (req, res, next) => {
    const userInfo = {
      username: req.body.username,
      name: req.body.name,
      familyName: req.body.familyName,
      password: req.body.password,
      role: req.body.role
    };

    const newUser = new User(userInfo);

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/newuser');
    });
  });

//boss deleteuser
roleController.get('/deleteuser', (req, res) => {
  res.render('users/delete', {});
});

module.exports = roleController;
