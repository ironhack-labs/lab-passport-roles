const express = require("express");
const courseController = express.Router();
const Course = require("../models/course");
const moment = require('moment');
const checkRoles = require('../middlewares/checkRoles');
const checkTA = checkRoles('TA');

courseController.get('/menu', (req, res) => {
  Course.find({}, (err, courses) => {
    res.render('course/menu', { courses: courses });
  });
});

courseController.get('/new', (req, res) => {
  res.render('course/new');
});

courseController.post('/new', (req, res) => {
  const { name, startingDate, endDate, level, available } = req.body;

  if (name === "" || startingDate === "" || endDate === ""
  || level === "" || available === "" ) {
    res.render('/admin/create-user', { message: "Indicate all fields" });
    return;
  }

  Course.findOne({ name }, "name", (err, user) => {
    if (user !== null) {
      res.render('/courses/new', { message: "Course already exists" });
      return;
    }

    const newCourse = new Course({
      name,
      startingDate,
      endDate,
      level,
      available
    });

    newCourse.save((err) => {
      if (err) {
        res.render('courses/new', { message: "Something went wrong" });
      } else {
        res.redirect("/courses/menu");
      }
    });
  });
});

courseController.post('/delete/:id', (req, res) => {
  let id = req.params.id;

  Course.findByIdAndRemove(id, (err, course) => {
    if (err){ return next(err); }

    return res.redirect('/courses/menu');
  });
});

courseController.get('/edit/:id', (req, res) => {
  let id = req.params.id;

  Course.findById(id,(err, course) => {
    res.render('course/edit', { course: course,
      startingdate: moment(course.startingDate).format('YYYY-MM-DD'),
      enddate: moment(course.startingDate).format('YYYY-MM-DD')});
  });
});

courseController.post('/edit/:id', (req, res) => {
  let id = req.params.id;

  const updates = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.available
  };

  Course.findByIdAndUpdate(id, updates, (err, course) => {
    if (err){ return next(err); }

    return res.redirect('/courses/menu');
  });
});

module.exports = courseController;
