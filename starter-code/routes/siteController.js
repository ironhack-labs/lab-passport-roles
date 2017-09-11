const router = require("express").Router()
const User = require("../models/user")
const passport = require('passport')

router.get("/", (req, res, next) => {
  res.render("index")
})

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash("error") })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

router.post('/logout',(req,res) =>{
  req.logout()
  res.redirect("/")
})

module.exports = router
