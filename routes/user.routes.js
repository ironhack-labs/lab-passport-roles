const express = require('express')
const router = express.Router()

const passport = require("passport")

// const User = require("../models/user.model")

// Endpoints


router.get("/login", (req, res, next) => res.render("user/login", { "message": req.flash("error") }))
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get('/logout', (req, res, next) => {
    req.logout()
    res.render('user/login', { message: 'Sesión cerrada' })
  })


module.exports = router