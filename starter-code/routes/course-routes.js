// routes/course-routes.js
const express = require("express");
const courseRoutes = express.Router();
const passport = require("passport");

// Course model
const Course = require("../models/course");



function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function checkRolesTADEVEDIT() {
  return function(req, res, next) {
    console.log("debug:"+req.user.username+ " params:"+req.params.username);
    if (req.isAuthenticated() && (req.user.role ==='Developer' || req.user.role==='TA') && req.user.username===req.params.username) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function checkRolesTADEV() {
  return function(req, res, next) {
    if (req.isAuthenticated() && (req.user.role ==='Developer' || req.user.role==='TA') ) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


const checkBoss  = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');
const checkTADEV = checkRolesTADEV();
const checkTADEVEDIT = checkRolesTADEVEDIT();



courseRoutes.get("/courseAdd", checkTA,(req, res, next) => {
  res.render("course/courseAdd");
});

courseRoutes.post("/courseAdd", (req, res, next) => {
  const name = req.body.name;
  const description = req.body.password;


  if (name === "" || description === "" ) {
    res.render("course/courseAdd", { message: "Indicate name and description" });
    return;
  }


  

  const course = new Course({
    name,
    description
  });

  course.save((err) => {
    if (err) {
      res.render("/dashboard", { message: "Something went wrong" });
    } else {
      res.redirect("/dashboard");;
    }
  });








});



  


module.exports = courseRoutes;