const express   = require('express');
const router    = express.Router();
const User      = require('../models/User')
const passport  = require('passport')

function checkRole(role){
  return (req,res,next)=>{
    if(req.isAuthenticated()&& req.user.role===role){
      next()
    } else{
      res.redirect("/")
    }
  }
}

router.get("/",checkRole("BOSS"),(req,res,next)=>{
  res.render("boss/index",req.user)
})

router.get('/signup',checkRole("BOSS"), (req, res) => {
  res.render('boss/signup')
})

router.post('/signup', (req, res, next) => {
  User.register(req.body, req.body.password)
  .then(user => res.redirect('/'))
  .catch(error => next(error))
})

router.get("/profile",checkRole("BOSS"),(req,res,next)=>{
  res.render("boss/profile",req.user)
})

module.exports = router