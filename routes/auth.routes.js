const express = require('express')
const router = express.Router()
const passport = require("passport")





router.get("/login", (req, res) => res.render("course/login"))

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))




module.exports = router