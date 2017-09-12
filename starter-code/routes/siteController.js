const router = require("express").Router()
const User = require("../models/User")
const passport = require('passport')



router.get("/", (req, res, next) => {
  res.render("index")
})

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash("error") })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

router.post('/logout',(req,res) =>{
  req.logout()
  res.redirect("/")
})


router.get('/private', checkRoles('Boss'), (req, res) => {
  res.render('private', {user: req.user});
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


module.exports = router
