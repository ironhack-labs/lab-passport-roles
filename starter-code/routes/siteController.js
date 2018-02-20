const express = require("express");
const siteController = express.Router();
const User = require("../models/User");
const bcrypt = require ("bcrypt");
const salt= bcrypt.genSaltSync (10);



siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup_form");
})
.post("/signup", (req,res,next)=>{
  const username = req.body.username,
        password = req.body.password;
  if(username === "" || password === ""){
      res.render("auth/signup_form", {message: "Indicate username and password"});
      return;
  }
 
  User.findOne({username}, "username", (err, user)=>{
     if (user !== null){
         res.render("auth/signup_form", {message:"The username already exists"});
         return;
     }
 
     const hashPass = bcrypt.hashSync(password, salt);
 
     const newUser = new User({
        username,
        password:hashPass
     });
 
     newUser.save(err=>{
         if (err) return res.render("auth/signup", { message: "Something went wrong" });
          res.redirect("/");
     });
 
  });
 });


//Usuarios



module.exports = siteController;
