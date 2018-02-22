const express = require("express");
const users = express.Router();
const passport = require("passport");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User = require('../models/user')
const ensureLogin = require("connect-ensure-login");

//Check if User is a Student and if true Deny Access
function checkStudent(){ 
  return function(req, res, next){
    if (req.isAuthenticated() && req.user.role === "Student") {
      
      res.redirect('/login')
    } 
    else{
      return next();
    }
  }
}
var checkStudent = checkStudent();



users.get("/", ensureLogin.ensureLoggedIn(), (req, res, next)=>{
    User.find({}, (err, users) => {
      if (err) { return next(err)}
      res.render("users/users", {users: users, userLogged: req.user});
    })
      
})


users.get("/:username", checkStudent, ensureLogin.ensureLoggedIn(), (req, res, next)=> {
  User.find({"username": req.params.username}, (err, user)=>{
    if (err){
      return next(err);
    }  
    // else if(req.user.role === "Student"){
    //   checkRoles("TA");
    // }
    res.render('users/user', {user: user[0]})
  });
});

users.post("/:username", checkStudent, ensureLogin.ensureLoggedIn(), (req, res, next)=>{
    const username=req.params.username;
    var updates={
      username: req.body.username,
      name: req.body.name,
      familyName: req.body.familyName,
      role: req.body.role
    }

    User.update({"username": username}, updates, (err, user)=>{
      if (err){
        return next(err);
      }  
      res.redirect("/users/" + username);
    });
});

users.get("/:username/edit", checkStudent, ensureLogin.ensureLoggedIn(), (req, res, next)=>{
  User.find({"username": req.params.username}, (err, user)=>{
    if (err){
      return next(err);
    } 
    res.render('users/edit', {user: user[0]})
  });
});

module.exports = users;