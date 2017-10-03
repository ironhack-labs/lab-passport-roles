const express = require("express");
const siteController = express.Router();
const passport = require("passport");
const User = require('../models/user')
const bcrypt = require('bcrypt')
const bcryptSalt = 10

// ==== HOME PAGE ====
siteController.get("/", (req, res, next) => {
  let welcomeMessage
  if (req.user) welcomeMessage = 'Hello ' + req.user.name
  else welcomeMessage = 'Hello Ironhacker'
  res.render("index", {
    welcomeMessage
  });
});

// ==== LOG IN ====
siteController.get("/login", (req, res, next) => {
  res.render("login", {
    message: req.flash("error")
  });
});

siteController.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// ==== LOG OUT ====
siteController.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// ==== ADDING A USER ====
siteController.get('/adduser', checkRoles('Boss'), (req, res, next) => {
  res.render('adduser')
});

siteController.post('/adduser', (req, res, next) => {
  let salt = bcrypt.genSaltSync(bcryptSalt)
  let hashPass = bcrypt.hashSync(req.body.password, salt)

  let newUser = new User({
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    password: hashPass,
    role: req.body.role
  })

  newUser.save((error) => {
    if (error) res.render('adduser', {
      message: 'Something went wrong - Couldnt add user'
    })
    else res.redirect('/')
  })
})

// ==== DELETING A USER ====
siteController.get('/deleteuser', checkRoles('Boss'), (req, res) => {
  res.render("deleteuser")
})

siteController.post('/deleteuser', (req, res, next) => {
  User.findOneAndRemove({
    username: req.body.username
  }, (error) => {
    if (error) throw error
    else res.redirect('/')
  })
})

// ==== USER PROFILE ====
siteController.get('/users/:username', (req, res, next) => {
  User.findOne({
    username: req.params.username
  }, (error, user) => {
    if (error) throw error
    res.render("userprofile", {
      username: user.username,
      name: user.name,
      familyName: user.familyName,
      role: user.role
    })
  })
})

// ==== USER LIST ====
siteController

// USER ROLE-CHECKING
function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) return next()
    else res.redirect('/login')
  }
}

module.exports = siteController;