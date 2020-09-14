const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10



router.get("/", (req, res, next) => res.render("index", { "message": req.flash("error") }))
router.post("/",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true,
  })
)

// Logout
router.get('/logout', (req, res, next) => {
    req.logout()
    res.render('/login', { message: 'Sesión cerrada' })
})



module.exports = router