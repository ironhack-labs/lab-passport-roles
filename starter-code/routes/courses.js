const express = require("express");
const courses = express.Router();
const passport = require("passport");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const Course = require('../models/course')
const ensureLogin = require("connect-ensure-login");

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

courses.get('/', (req, res, next)=>{
  Course.find({}, (err, courses)=>{
    res.render('courses/courses', {courses: courses})
  })
});

courses.get('/new', checkTA, (req, res, next)=>{
    res.render('courses/new')
});

courses.post('/', checkTA, (req, res, next)=>{
      const courseInfo = 
      {name:req.body.name,
      startingDate: req.body.startingDate,
      endDate:req.body.endDate,
      level : req.body.level,
      available:req.body.available}

    if(courseInfo.name ==="" || courseInfo.level === "" || courseInfo.available ===
  ""){
        res.render('courses/new', {message: "Please fill in all fields"});
    }

    const newCourse = new Course(courseInfo);

    newCourse.save((err)=>{
      if (err){
        res.render('courses/new', {message: "Something went wrong"});
      } else {
        res.redirect('/courses');
      }
    });
});

courses.get("/:id/edit", checkTA, (req, res, next)=>{
    var id = req.params.id;

    Course.findById(id, (err, course)=>{
        if(err) {return next(err)};
        res.render('courses/edit', {course:course})
    });
  });

courses.post("/:id", checkTA, (req, res,next)=>{
    var id = req.params.id

    const updates = {
      name:req.body.name,
      startingDate: req.body.startingDate,
      endDate: req.body.endDate,
      level : req.body.level,
      available: req.body.available}

    Course.findByIdAndUpdate(id, updates, (err, course)=>{
        if(err){return next(err)};
        res.redirect("/courses");
  });
});

courses.post("/:id/delete", checkTA, (req, res, next)=>{
    var id = req.params.id

    Course.findByIdAndRemove(id, (err, course)=>{
      if(err){return next(err)};
      res.redirect('/courses');
  });
});

module.exports = courses