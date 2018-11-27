const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User = require("../models/User");



router.post('/login', passport.authenticate("local",{failureRedirect:'/login'}), (req,res,next)=>{
    res.redirect('/profile')
})


router.get('/profile', (req, res, next) => {
  const user = req.user
  res.render('profileBoss', user)
});

router.get('/login', (req, res, next) => {
  // User.register({username:"JEFECITO", role:"BOSS"}, 'admin')
  // .then(user=>{
  //   res.send(user)
  // }).catch(err=>{
  //   console.log(err)
  // })
  res.render('auth/login')

});


router.get('/newEmployee', (req, res, next) => {
  
  res.render('newEmployee')

});

router.post('/newEmployee', (req, res, next) =>{
  User.register(req.body, 'pass123')
  .then(user=>{
    res.send(user)
  }).catch(err=>{
    console.log(err)
  })
});

module.exports = router;
