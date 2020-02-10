  const express = require("express");
  const router = express.Router()
  // Require user model
  const User = require('../models/user.model')
  // Add passport 
  const passport = require('passport')
  const ensureLogin = require("connect-ensure-login")



  router.get('/signup', (req, res) => res.render('passport/signup-form'))
  



  router.get('/login', (req, res) => {
    res.render('passport/login-form', {
      message: req.flash("error")
    })
  })
  router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }))

  router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
  })

  module.exports = router