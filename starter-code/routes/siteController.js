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
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ username: username }, (err, user) => {
  if(err) {return next(err)}

  if(username === "" || password === "") {
    res.render('passport/login', {
      errorMessage: "Write a password or username"
    })
    return;
  }

  if(Boss.username !== "username" || Boss.password !== "password") {
    res.render('passport/login' , {
      errorMessage: "You can not loggin in"
    })
  }
  
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true

})

router.post('/logout',(req,res) =>{
  req.logout()
  res.redirect("/")
})


module.exports = router
