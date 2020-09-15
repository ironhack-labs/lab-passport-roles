const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User.model')

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Endpoints

router.get("/login", (req, res, next) => {

    let message
    req.user ? message = '' : message = req.flash("error")

    res.render("auth/login", { message })

})

router.post("/login", passport.authenticate("local", {
    successRedirect: `/employees/profile`,
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
}))


router.get('/logout', (req, res) => {

    req.logOut()
    res.redirect('login')

})


module.exports = router