const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const passport = require("passport");

function checkRole(role){
  return function(req,res,next){
    if(req.isAuthenticated() && req.user.role === role)
    return next();
    res.redirect("/private");
  }
 } 

 const check = checkRole("Boss");

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
    return res.redirect("/privateBoss");
  } 
  const {username, email, password, role} = req.body;
  User.register({username, email, role}, password) 
  .then(user =>{
    res.json(user);
  })
  res.redirect("/privateBoss");
});

router.get('/privateUsers',check,(req,res,next)=>{
  User.find() //método de búsqueda para recuperar todas las celebridades.
    .then( user => {
      res.render('employees',{user})
    }).catch(e=>next(e))
})

router.post("/privateUsers/:id/delete", (req,res)=>{
  User.findByIdAndRemove(req.params.id)
  .then(User => {
    res.redirect("/privateBoss")
  })
  .catch(e=>next(e))
})

module.exports = router;