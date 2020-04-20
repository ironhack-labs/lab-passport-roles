const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const passport = require("passport")
const ensureLogin = require("connect-ensure-login")
const flash = require("connect-flash")

// Login
router.get("/login", (req, res, next) => res.render("auth/login", {errorMessage: req.flash("error")}))

router.post("/login", passport.authenticate("local", {
    successRedirect: "/privateArea",
    failureRedirect: 'login',
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: "Rellena todos los campos"
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})


module.exports = router;
