const express = require('express')
const router = express.Router()

const passport = require('passport')

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Endpoints
router.get('/', (req, res) => {
    res.render('index')
})


//LOGIN

router.get('/login', (req, res) => res.render('auth/login', { "message": req.flash("error") }))

router.post('/login', passport.authenticate("local", {
    successRedirect: "/employees",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))



// LOGOUT

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
  })

  
module.exports = router