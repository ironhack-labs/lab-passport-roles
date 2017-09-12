const passport = require('passport')
const router = require('express').Router()


router.get('/login',(req,res) =>{
  res.render('auth/login',{ message: req.flash("error") })
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
