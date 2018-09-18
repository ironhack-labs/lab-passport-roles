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

router.get("/",checkRole("TA"),(req,res,next)=>{
  res.render("ta/index",req.user)
})

router.get("/profile",checkRole("TA"),(req,res,next)=>{
  res.render("ta/profile",req.user)
})
module.exports = router