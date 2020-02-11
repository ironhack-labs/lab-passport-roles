const express = require("express")
const router = express.Router()

const User = require("../models/usermodel")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport");



router.get("/", (req, res) => res.render("auth/login-form"))

router.post('/', passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}))

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")
})


module.exports = router