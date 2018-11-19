const express = require('express');
const router = express.Router();
// Require course model
const Course = require('../models/Course.js');
// Add passport 
const passport = require('passport');
const session = require('express-session');
const ensureLogin = require("connect-ensure-login");

const Superrol = ["Boss"];
const Adminsrol = ["Boss", "Developer", "TA"];

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && role.includes(req.user.rol)) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

router.get("/courses", checkRoles(Adminsrol), (req, res) => {
  Course.find({})
    .then(course => {
      res.render('course/courses', { course })
    })
    .catch(error => console.log("Error to find a course" + error))
})

router.get("/coursesadd", checkRoles(["TA"]), (req, res) => {
  Course.find({})
    .then(course => {
      res.render('course/coursesadd', { course })
    })
    .catch(error => console.log("Error to find a course" + error))
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
})

router.get('/course/:_id', checkRoles(Adminsrol), (req, res, next) => {
  Course.findById(req.params._id)
    .then(course => {
      res.render('course/courseid', { course })
    })
    .catch(error => console.log("Error to find a course" + error))
})

router.post('/coursesadd', checkRoles(["TA"]), (req, res, next) => {
  if (req.body.course === "") {
    console.log("The course value cant be null")
    res.redirect('/coursesadd')
  } else {
    const genericCourse = new Course();
    genericCourse.course = req.body.course;
    genericCourse.save()
      .then(() => {
        res.redirect('/coursesadd')
      })
      .catch(error => {
        console.log("Error to create a new course" + error)
        res.redirect('/coursesadd')
      })
  }
})

router.post('/course/:_id/edit', checkRoles(["TA"]), (req, res, next) => {
  courseEdited = {}
  courseEdited.course = req.body.course;
  Course.findByIdAndUpdate(req.params._id, courseEdited)
    .then(() => {
      res.redirect('/courses')
    })
    .catch(error => console.log("Error to update a course" + error))
})

router.post('/course/:_id/delete', checkRoles(["TA"]), (req, res, next) => {
  console.log("ESTA ENTRANDO")
  Course.findByIdAndRemove(req.params._id)
    .then(() => {
      res.redirect('/coursesadd')
    })
    .catch(error => console.log("Error to remove a course" + error))
})
module.exports = router;