const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/signup', (req,res)=>{
  res.render('auth/signup')
})

router.post('/signup', (req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(user=>res.redirect('/login'))
  .catch(err=>next(err))
})

router.get('/login', (req,res)=>{
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local'), (req,res,next)=>{
  req.app.locals.user = req.user;
  res.redirect('/boss')
})


router.get('/delete/:id', (req,res)=>{
  let id = req.params.id;
  User.findByIdAndRemove(id)
  .then(user=>res.redirect('/boss'))
})

router.post('/add', (req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(user=>res.redirect('/boss'))
  .catch(err=>next(err))
})


module.exports = router;