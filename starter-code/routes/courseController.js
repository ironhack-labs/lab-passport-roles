const express = require("express");
const employeesController = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
// Bcrypt to encrypt passwords
const ensureLogin = require("connect-ensure-login");

employeesController.get("/courses", (req, res, next) => {
  let user = req.user;
  console.log("User", user);
  Course.find({}, (err, docs) => {
    if (err) { return next(err); }
    return res.render("courses/list", {docs, user});
  });
});

employeesController.get("/courses/edit/:id", (req, res, next) => {
  let courseId = req.params.id;

  Course.findOne({"_id": courseId}, (err, course) => {
    if (err) { return next(err); }
    return res.render("courses/edit", course);
  });
});

employeesController.post("/courses/edit/:id", (req, res, next) => {
  let courseId = req.params.id;
  console.log("curso Id", courseId);
  let courseInfo = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.available
  };

  Course.findByIdAndUpdate(courseId, courseInfo, (err, course) => {
    console.log("curso", course);
    if (err) { return next(err); }
    return res.redirect("/courses");
  });
});

employeesController.get('/courses/remove/:id', (req, res, next) => {
  let courseId = req.params.id;

  Course.findByIdAndRemove(courseId, (err, employee) => {
    if (err) { return next(err); }
    return res.redirect('/courses');
  });
});

employeesController.get("/courses/add", (req, res, next) => {
  res.render("courses/add");
});

employeesController.post('/courses/add', (req, res, next) => {
  const newCourse = new Course({
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.available
  });

  newCourse.save(err => {
    if (err) { return res.render('courses/add'); }
    return res.redirect('/courses');
  });
});


module.exports = employeesController;
