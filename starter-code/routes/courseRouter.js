const express = require('express');

const courseRouter = express.Router();

const ensureLogin = require('connect-ensure-login');

const Course = require('../models/Course');

courseRouter.get('/courses', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.find()
    .then(courses => res.render('courses', { courses }))
    .catch(err => next(err));
});

courseRouter.get('/courses/create', ensureLogin.ensureLoggedIn(), (req, res, next) => res.render('courseCreate'));

courseRouter.get('/courses/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.findById(req.params.id)
    .then(myCourse => res.render('course', { myCourse }))
    .catch(err => next(err));
});

courseRouter.post('/courses/create', (req, res, next) => {
  const newCourse = new Course({
    name: req.body.newName,
    content: req.body.newContent,
  });

  Course.create(newCourse)
    .then(() => res.redirect('/courses'))
    .catch(err => next(err));
});

module.exports = courseRouter;
