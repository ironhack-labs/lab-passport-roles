const express       = require('express');
const courseRouter  = express.Router();
const Course        = require('../models/Course');
const User          = require('../models/User');
const bcrypt        = require('bcrypt');
const bcryptSalt    = 10;
const passport      = require('passport'); 
const secure        = require('../middlewares/secure');
const ensureLogin   = require("connect-ensure-login");

courseRouter.get('/courses', secure.checkLogin, (req, res, next) => {
  Course.find()
    .then(course => {
      if (req.user.role === 'Developer' || req.user.role === 'Boss') {
        res.render('courses/courses-basic', {course})
      } else if (req.user.role === 'TA') {
        res.render('courses/courses', {course})
      } else {
        res.render('notallowed')
      }
    })
    .catch(err => console.log('Course can not be found', err))
});

courseRouter.get('/courses/new', secure.checkRole('TA'), (req, res, next) => {
  res.render('courses/new');
});

courseRouter.post('/courses/new', secure.checkRole('TA'), (req, res, next) => {
  const { name } = req.body;

  if (name === '') {
    res.render('courses/new', { message: 'Please indicate a name' });
    return;
  }

  Course.findOne({ name })
    .then((course) => {
      if (course) {
        res.render('courses/new', { message: 'Course already exists'})
        return;
      }
      
      const newCourse = new Course ({ name });

      newCourse.save()
        .then(() => res.redirect('/courses'))
        .catch(error => next(error))
    }) 
    .catch(error => next(error))
});

courseRouter.post("/courses/delete/:id", secure.checkRole('TA'), (req, res, next) => {
  const courseId = req.params.id;
  Course.findByIdAndRemove(courseId)
    .then(() => {
      console.log('Removed course');
      res.redirect("/courses");
    })
    .catch(err => {
      console.log("Couldn't delete this course, sorry" ,err);
      next();
    });
});

courseRouter.get('/courses/edit/:id', secure.checkRole('TA'), (req, res, next) => {
  const courseId = req.params.id;
  Course.findById(courseId)
  .then(course => res.render('courses/edit', {course}))
  .catch(err => console.log('Couldnt edit:', err))
})

courseRouter.post('/courses/edit/:id', secure.checkRole('TA'), (req, res, next) => {
  const courseId = req.params.id;
  const { name } = req.body
  Course.findByIdAndUpdate(courseId, {$set: { name }}, {new: true})
    .then(() => res.redirect('/courses'))
    .catch(err => console.log('Couldnt update:', err))
})


module.exports = courseRouter;