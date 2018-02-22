const express = require("express");
const siteController = express.Router();
const passport = require("passport");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User = require('../models/user')

function checkRoles(role){ 
  return function(req, res, next){
    if (req.isAuthenticated() && req.user.role === role) {
        return next();
    } 
    else{
      res.redirect('/login')
    }
  }
}

var checkBoss= checkRoles('Boss');
var checkTA= checkRoles("TA");
var checkDeveloper = checkRoles('Developer')


siteController.get("/", (req, res, next) => {
  res.render("index", {user: req.user});
});

siteController.get("/login", (req, res, next) => {
  res.render("auth/login", {message: req.flash('error')});
});

siteController.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true, 
    passReqToCallback: true
}));

siteController.get("/employees", checkBoss, (req, res, next)=> {
      res.render('employees', {user: req.user})
});

siteController.post("/addEmployees", (req, res, next)=>{
    var username = req.body.username; 
    var name = req.body.name;
    var familyName = req.body.familyName;
    var password = req.body.password;
    var role = req.body.role;

    if(username === "" || name==="" || familyName ==="" 
    || password ==="" || role===""){
      res.render("employees", {message: "Indicate a username, name, family name, password, and role"});
      return;
    }

    User.findOne({username}, "username", (err, user) => {
      if (user !== null){
        res.render("employees", {message: "The username already exists"})
        return;
      }

      var salt = bcrypt.genSaltSync(bcryptSalt);
      var hashPass = bcrypt.hashSync(password, salt);

    var newUser = new User({
      username: username, 
      name: name, 
      familyName: familyName, 
      password: hashPass, 
      role: role
    });

    newUser.save((err)=>{
      if (err){
        res.render("employees", {message: "Something went wrong"})
      }
      else {
        res.redirect("/")
      }
    });
  });
});

siteController.post("/deleteEmployees", (req, res, next)=>{
    var name = req.body.name;
    var familyName = req.body.familyName;

    User.remove({"name": name, "familyName": familyName}, (err)=>{
      if (err){
        res.render('employees', {message: "Something went wrong"})
      }
      else{
        res.redirect('/')
      }
    });
});

siteController.get("/logout", (req, res, next) =>{
      req.logout();
      res.redirect("/");
});

siteController.get("/auth/facebook", passport.authenticate("facebook"));
siteController.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/",
  failureRedirect: "/login"
}));



module.exports = siteController;
