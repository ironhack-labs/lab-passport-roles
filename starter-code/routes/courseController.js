const express = require('express');
const courseController = express.Router();
const ensureLogin = require('connect-ensure-login');
const User = require('../models/User');
const Course = require('../models/Course');
const moment = require('moment');

courseController.get('/', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res) => {
  Course.find({}, (err, courses)=>{
    err ? next(err) : res.render('courses/index', {courses: courses});
  })

});

courseController.get('/new', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  res.render('courses/new');
});

courseController.post('/', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {

  var coursesData = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.available ? true : false
  }

  var newCourse = new Course(coursesData);
  newCourse.save((err) => {
    err ? res.render( 'courses/new', { errorMessage: err }) : res.redirect('/courses');
  });
});

courseController.post('/:id/delete',ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  let id = req.params.id

  Course.findByIdAndRemove(id, (err, course) => {
    return  err ? next(err) : res.redirect('/courses');
  });
});

courseController.get('/:id/edit', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {

  let id = req.params.id

  Course.findById(id, (err, course) => {
    return err ? next(err) : res.render('courses/edit', { course: course, moment: moment });
  });

});

courseController.post('/:id', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  let id = req.params.id

  const updates = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.available ? true : false
  };

  Course.findByIdAndUpdate(id, updates, (err, course) => {
    return err ? next(err) : res.redirect("/courses");
  });
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = courseController;
