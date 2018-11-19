const express = require('express');

const courseRouter = express.Router();

const ensureLogin = require('connect-ensure-login');

const Course = require('../models/Course');

const User = require('../models/User');

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

courseRouter.get('/courses/:id/addUser', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.findById(req.params.id)
    .then((myCourse) => {
      User.find()
        .then(users => res.render('addUser', { myCourse, users }))
        .catch(err => next(err));
    })
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

courseRouter.post('/courses/:id/addUser', (req, res, next) => {
  Course.findByIdAndUpdate(req.params.id, { users: req.body.chosenUser })
    .then(() => res.redirect('/courses'))
    .catch(() => res.redirect(`/courses/${myCourse.id}/addUser`));
  // .then(myCourse => myCourse.users.push('pepa')
  //   .then(() => res.redirect('/courses'))
  //   .catch(() => res.redirect(`/courses/${myCourse.id}/addUser`)))
  // .catch(err => next(err));
});

module.exports = courseRouter;
