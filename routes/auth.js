const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const passport = require("passport");


router.get("/register", (req,res)=>{
  res.render("login")
});

router.post("/register", (req,res)=>{
  if(req.body.password !== req.body.confirmPassword){
    res.render("login", {err: "Las contraseñas no coinciden"})
    return 
  } 
  const {username, email, password} = req.body;
  User.register({username, email}, password) 
  .then(user =>{
    res.json(user);
  })
});

module.exports = router;