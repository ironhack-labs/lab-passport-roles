const express = require("express");
const siteController = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);


//ensure login
const ensureLogin = require("connect-ensure-login");

//passport
const passport = require("passport");


//login

siteController.get("/login", (req,res)=>{
  res.render("login", {"message":req.flash("error")});
});

siteController.post("/login", passport.authenticate("local", {
   successRedirect: "/private",
   failureRedirect: "/login",
   failureFlash: true,
   passReqToCallback: true
}));

//logout
siteController.get("/logout", (req,res)=>{
  req.logout();
  res.redirect("/login");
});

//signup
siteController.get("/signup", (req,res, next)=>{
  res.render("signup");
})

.post("/signup", (req,res,next)=>{
  const username = req.body.username,
        password = req.body.password;
  if(username === "" || password === ""){
      res.render("signup", {message: "Indicate username and password"});
      return;
  }

  User.findOne({username}, "username", (err, user)=>{
     if (user !== null){
         res.render("signup", {message:"The username already exists"});
         return;
     }

     const hashPass = bcrypt.hashSync(password, salt);

     const newUser = new User({
        username,
        password:hashPass
     });

     newUser.save(err=>{
         if (err) return res.render("signup", { message: "Something went wrong" });
          res.redirect("/private");
     });

  });
});

//private
siteController.get("/private", (req,res, next)=>{
  res.render("private");
})

//index
siteController.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = siteController;


