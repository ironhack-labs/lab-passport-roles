const express = require("express");
const courseController = express.Router();
const Course = require('../models/Course');
// EnsureLogin for private page.
const ensureLogin = require("connect-ensure-login");

courseController.get('/', ensureLogin.ensureLoggedIn(), (req, res) => {
    Course.find({}, (err, courses) => {
      res.render('courses/main', { courses: courses, user:req.user.role})
    });
});

// CREATE COURSES
courseController.get('/new', ensureLogin.ensureLoggedIn(), (req, res) => {
  if(req.user.role == 'Developer' || req.user.role == 'TA') res.render('courses/new');
  res.redirect('/')
});

courseController.post('/new', ensureLogin.ensureLoggedIn(), (req, res) => {
  const name = req.body.name;
  const startingDate = req.body.startingDate;
  const endDate = req.body.endDate;
  var available;
  if(req.body.avaliable == "true") {
    available = true;
  } else {
    available = false;
  }
  const level = req.body.level;

  if (name == "" || level == ""){
    res.render("courses/new", {
      errorMessage: "Indicate name and level"
    });
    return;
  }

  var newCourse = Course({
    name,
    startingDate,
    endDate,
    available,
    level,
  });

  newCourse.save(error => {
    if (error) {
      res.render("courses/new", {
        errorMessage: "Couldn't create a new course"
      });
    } else {
      console.log('New Course Created!');
      res.redirect('/courses');;
    }
  });
});

// EDIT COURSES
courseController.get('/:id/edit', ensureLogin.ensureLoggedIn(), (req, res) => {
  if(req.user.role == 'Developer' || req.user.role == 'TA'){
    Course.findById({_id: req.params.id}, (error, course) => {
      res.render('courses/edit', {course: course});
    })
  }
});

courseController.post('/:id/edit', ensureLogin.ensureLoggedIn(), (req, res) => {
  var updateObj = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.avaliable,
  };

  Course.findByIdAndUpdate(req.params.id, updateObj, (error, course) => {
    res.redirect('/courses');
  })
});

// DELETE COURSES
courseController.get('/:id/delete', ensureLogin.ensureLoggedIn(), (req, res) => {
  if(req.user.role == 'Developer' || req.user.role == 'TA'){
    Course.findByIdAndRemove({_id: req.params.id}, (error) => {
      res.redirect('/courses');
    })
  }
});



module.exports = courseController;
