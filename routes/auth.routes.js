const express = require("express")
const router = express.Router()
const passport = require("passport")


router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))


router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})




module.exports = router;
