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

router.get("/",(req,res,next)=>{
  res.render("developer/index",req.user)
})

module.exports = router