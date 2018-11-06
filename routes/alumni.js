const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Courses")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function checkRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next()
    }
    else {
      res.redirect('/')
    }
  }
}

router.get('/all-profiles', checkRole('STUDENT'), (req, res, next) => {
  User.find({ role: 'STUDENT' })
    .then(alumnis => {
      res.render('alumni/all-alumnis', {
        alumnis: alumnis
      })
    })
})

router.get('/courses', checkRole('STUDENT'), (req, res, next) => {
  Course.find()
    .then(courses => res.render('alumni/courses', {
      courses: courses
    }))
})



module.exports = router;