const router   = require('express').Router()
const User     = require('../models/User')
const passport = require('passport')

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  User.register(req.body, req.body.password)
  .then(user => res.redirect('/login'))
  .catch(error => next(error))
})

router.get('/login', (req, res) => {
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local'),(req,res,next)=>{
  if(req.user.role === "BOSS"){
  res.redirect('/boss')
  }else if (req.user.role === "TA"){
  res.redirect('/ta')
  }else{
    res.redirect('/developer')
  }
})

module.exports = router