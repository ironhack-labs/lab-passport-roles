const express = require("express");
const siteController = express.Router();
const Course = require("../models/Course");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');
const debug = require('debug')("app:auth:local");

const checkBoss = checkRoles('BOSS');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("login", {
    message: req.flash("error")
  });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get('/private', checkBoss, (req, res) => {
  User.find({}).exec(function(err, users) {
    if (err) throw err;
    res.render('private', {
      user: req.user,
      users: users
    });
  });
});


// siteController.get('/edit', (req, res) => {
//   res.render('');
// });

siteController.get('/create', (req, res) => {
  res.render('create');
});

siteController.post('/create', (req, res) => {
const username = req.body.username;
const password = req.body.password;
const name = req.body.name;
const familyName = req.body.familyName;
const role = req.body.role;


if (username === "" || password === "" || name === "" || familyName === "" || role === "") {
  res.render("/create", {
    errorMessage: "All fields requiered"
  });
  return;
}

User.findOne({ "username": username }).then(user =>{
  if(user){
    res.render("/create", {
      errorMessage: "User already exists"
    });
    return;
  }
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  new User({
      username: username,
      name: name,
      familyName: familyName,
      password: hashPass,
      role: role

    })
    .save()
    .then(() => res.redirect('/private'))
    .catch(e => next(e));
});

});

// siteController.get('/delete', (req, res) => {
//   res.render('');
// });
//


siteController.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});


function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/');
    }
  };
}

module.exports = siteController;
