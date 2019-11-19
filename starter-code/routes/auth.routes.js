const express = require('express')
const router = express.Router()
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

//---LOGIN FORM RENDER---//
router.get("/login", (req, res) => res.render("auth/login", {
    "message": req.flash("error")
}));

//---LOGIN SEND FORM---//
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

//---PRIVATE PAGE---//
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => res.render("private", {
    user: req.user
}));

//---LOGOUT---//
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router;