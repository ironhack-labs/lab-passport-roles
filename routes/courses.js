const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');
const Courses = require('../models/course');
const Users = require('../models/user');

router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Courses.find()
      .then(course => {
        //   res.send(course);
        res.render('courses/courses', {course});
      })
      .catch(err => {
        console.log('WhatChaMaCallIt nowadays all these kids be tryna learn but they ain\'t know NUTTIN: ', err);
        next();
      });
  });

function checkRoles(role){
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.redirect('/login');
      }
    };
}

router.get('/add', checkRoles('TA'), (req, res, next) => {
    res.render('courses/add');
});

router.post('/add', (req, res, next) => {
    const {title, description, content, resource} = req.body;
    const newCourse = new Courses({title, description, content, resource})
    newCourse.save()
        .then(course => {
            res.redirect('/courses');
        })
        .catch(err => {
            console.log('You tryna be educational up in here??: ', err);
            next();  
        });
});

router.get('/:id', (req, res, next) => {
    Courses.findOne({_id: req.params.id})
        .then(course => {
            res.render('courses/show', {course});
        })
        .catch(err => {
            console.log('Say that you wanna have a hairdo like the folks who live up there do go an flap your wing!: ', err);
            next();
        });
});

router.get('/edit/:id', checkRoles('TA'), (req, res, next) => {
    Courses.findOne({_id: req.params.id})
        .then(course => {
            res.render('courses/edit', {course});
        })
        .catch(err => {
            console.log('This course has been quarantined and cannot be revived nor edited. Please try again: ', err);
            next();
        });
});

router.post('/edit/:id', (req, res, next) => {
    const {title, description, content, resource} = req.body;
    Courses.findByIdAndUpdate({_id: req.params.id}, {title, description, content, resource})
        .then(course => {
            res.redirect('/courses/'+course._id);
        })
        .catch(err => {
            console.log('Yup you just tried editing me and you got WRECKED whatcha gon do??: ', err);
            next();
        });
});

router.get('/edit/:id/addmembers', (req, res, next) => {
    let obj = {};
    Users.find({role: 'Student'})
        .then(students => {
            obj.students = students;
            // res.render('courses/addmembers', {req});
            // res.send(students);
        })
        .catch(err =>{
            console.log('Students don\'t like education, why are you forcing them to learn?', err);
            next();
        });
    Courses.findOne({_id: req.params.id})
        .then(course => {
            obj.course = course;
            // res.render('courses/edit', {course});
        })
        .catch(err => {
            console.log('This course has been quarantined and cannot be revived nor edited. Please try again: ', err);
            next();
        });
    res.render('courses/addmembers', {obj})
});

router.post('/edit/:id/addmembers', (req, res, next) => {
    const {student} = req.body;
    const members = {student}.student;
    Courses.findByIdAndUpdate({_id: req.params.id}, {members})
        .then(course => {
            res.redirect('/courses/'+course._id)
            // res.send(course);
        })
        .catch(err => {
            console.log('This course wishes to remain the same, look but don\'t touch: ', err);
            next();
        });
});

router.get('/delete/:id', (req, res, next) => {
    Courses.findByIdAndRemove({_id: req.params.id})
        .then(course => {
            res.redirect('/courses');
        })
        .catch(err => {
            console.log('Delete me and I\'ll delete your soul:', err);
            next();
        });
});

module.exports = router;