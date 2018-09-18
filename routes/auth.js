const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const passport = require('passport')
/* GET Iniciar sesión */
router.get('/login', (req,res,next)=>{
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local',
{
  successRedirect:'/school', 
  failureRedirect: '/login'
}),(req,res)=>{

})



router.get('/signup', (req,res,next)=>{
  res.render('auth/signup')
})

router.post('/signup', (req,res,next)=>{
  User.register(req.body, req.body.password, req.username, req.body.role)
  .then(user=> res.redirect('/login'))
  .catch(err=>next(err))
})

module.exports = router