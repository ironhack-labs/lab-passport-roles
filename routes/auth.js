const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const passport = require("passport");


const checkIfRole = (req,res,next)=>{
    User.findOne({username:req.body.username})
    .then(user=>{
        if(user.role === "BOSS"){
            return next();
          }else res.send("No jala bro")

    })
    .catch(e=>console.log(e))
   
  };


router.post("/signup",(req,res,next)=>{
    if(req.body.password1 !== req.body.password2){
        req.body.error = "Contrasenas no coinciden";
        return res.render(".signup/signup",req.body)
    }
    User.register(req.body,req.body.password1,(err,user)=>{
        if(err) return next(err);
        res.redirect("/login")
    })
})

router.get("/signup", (req,res)=>{
    res.render("./signup/signup")
})

router.get("/login", (req,res)=>{
    res.render("signup/login")
})

router.post("/login", checkIfRole, (req,res,next)=>{
    res.redirect("/boss")
})

router.get("/boss",(req,res)=>{
    res.render("boss")
})

module.exports = router;