const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const passport = require("passport");


router.get("/login", (req,res)=>{
  res.render("login")
});

router.post("/login", passport.authenticate("local"), (req,res)=>{
  if(req.body.password === "" || req.body.username === ""){
    res.render("login", { err: "Indicate username or password" });
    return;
  }
  res.redirect("/privateBoss");
});

router.post("/logout", (req,res)=>{
  req.logout();
  res.redirect("/auth/login");
});

router.post("/privateBoss", (req,res)=>{
  if(req.body.password !== req.body.confirmPassword){
    res.render("private", {err: "Las contraseñas no coinciden"})
    return 
  } 
  const {username, email, password, role} = req.body;
  User.register({username, email, role}, password) 
  .then(user =>{
    res.json(user);
  })
  res.redirect("/privateBoss");
});

module.exports = router;