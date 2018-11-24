
const express = require("express");
const courseRoutes = express.Router();
const {isLoggedIn} = require('../middlewares/isLogged');
const {roleCheck} = require('../middlewares/roleCheck');
const Course = require("../models/Course");


courseRoutes.get('/courses/:courseId/profile', (req, res, next) => {
  Course.findById(req.params.courseId).then(course => {
    res.render('courses/profile',{course})
  }).catch((error)=> {
    console.log(`Can't show course profile`)
    res.render('/courses');
  });
});

courseRoutes.get('/courses/add', [isLoggedIn('/login'), roleCheck(["TA"])], (req, res, next) => {
  res.render('courses/add');
});

courseRoutes.post('/courses/add', [isLoggedIn('/login'), roleCheck(["TA"])], (req, res, next) => {
  const course = {
    name: req.body.name,
    creator: req.body.creator
  };
  if (course.name === "" || course.creator === "") {
    req.flash('error', "Indicate course name and creator");
    res.redirect("/courses/add");
    return;
  }
  Course.create(course).then(course => {
    console.log(`Created course: ${course._id} ${course.name} by ${course.creator}`);
    res.redirect('/courses');
  })
  .catch((error)=> {
    console.log(error);
    res.render('courses/add');
  });
});

courseRoutes.get('/courses/:courseId/delete', [isLoggedIn('/login'), roleCheck(["TA"])], (req,res) => {
  Course.findByIdAndDelete(req.params.courseId).then(()=> {
    res.redirect('/courses');
  })
  .catch((error)=> {
    console.log(`Can't delete course`)
    res.redirect('/courses');
  });
});

courseRoutes.get('/courses/:courseId/edit', [isLoggedIn('/login'), roleCheck(["TA"])], (req,res) => {
  Course.findById(req.params.courseId).then(course => {
    res.render('courses/edit', {course})
  }).catch((error)=> {
    console.log(error);
    res.render(`courses/${req.params.courseId}/profile`);
  });
});

courseRoutes.post('/courses/:courseId/edit', [isLoggedIn('/login'), roleCheck(["TA"])], (req,res) => {
  const course = {
    name: req.body.name,
    creator: req.body.creator
  };
  const courseId = req.params.courseId;
  Course.findByIdAndUpdate(courseId, course).then(() => {
    res.redirect(`/courses/${courseId}/profile`);
  });
});

module.exports = courseRoutes;
