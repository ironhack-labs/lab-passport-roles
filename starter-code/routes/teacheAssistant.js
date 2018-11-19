const express = require("express");
const taRoutes = express.Router();
// Require  models
const User = require("../models/user");
const Course = require('../models/Course');



taRoutes.get('/teacherA/create-course',(req,res,next)=>{
  console.log('holaa')
    res.render('user/createCourse');

})

taRoutes.post('/teacherA/create-course',(req,res,next)=>{
  var objCourse = {
    namecourse: req.body.namecourse,
    professor: req.body.professor,
    duration: req.body.duration
  };

  

  const newCourse = new Course();

  newCourse.namecourse = objCourse.namecourse;
  newCourse.professor = objCourse.professor;
  newCourse.duration = objCourse.duration;

  newCourse
    .save()
    .then(() => {
      res.redirect("/profiles");
    })
    .catch(() => {
      req.redirect("/profiles");
    });
})

module.exports = taRoutes;