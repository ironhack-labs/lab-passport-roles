
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


const Course = require('../models/course');

router.get('/',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.find({})
    .then(responses => {
      res.render('./courses/index', {courses: responses, user: req.user })
    })
    .catch(err => {
      res.render('./error', err)
    });
});

router.get('/new', (req, res, next) => {
  res.render('./courses/new', {user: req.user });
});

router.get('/:id/edit',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.findOne({_id: req.params.id})
    .then(Course => {
      res.render('./courses/edit', {Course, user: req.user });
    })
    .catch(err => {
      res.render('./error', err)
    })
});


router.get('/:idCourse',ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.findOne({_id : req.params.idCourse})
    .then(Course => { 
      res.render('./courses/show', {user: req.user, Course });
    })
    .catch(err => {
      res.render('./error', err)
    })
})

router.post('/new', (req, res, next) => {
  Course.create(req.body)
    .then(result => {
      res.redirect('/courses')
    })
    .catch(err => {
      res.render('./error', err)
    });
});

router.post('/:id/delete', (req, res, next) => { 
  Course.findOneAndDelete({_id : req.params.id})
    .then(result => {
      res.redirect('/courses');
    })
    .catch(err => {
      res.render('./error', err)
    })
});


router.post('/:id/edit', (req, res, next) => {
  Course.findOneAndUpdate({_id: req.params.id} , req.body)
    .then(result => {
      console.log('curso actualizadao:', result);
      res.redirect('/courses');
    })
    .catch(err => {
      res.render('./error', err)
    })
})


module.exports = router;