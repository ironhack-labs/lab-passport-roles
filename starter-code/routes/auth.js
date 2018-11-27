const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const passport = require('passport')

/* GET home page */
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate("local",{failureRedirect:"/auth/login"}), (req, res, next)=>{
  const username = req.user.username
  req.app.locals.user = req.user
  res.redirect('/profile')
})

router.get('/logout', (req, res)=>{
  req.logOut()
  res.redirect("/auth/login")
})

module.exports = router;