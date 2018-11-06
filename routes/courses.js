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

router.get('/', checkRole('TA'), (req, res, next) => {
  Course.find()
    .then(courses => res.render('courses/index', {
      courses: courses
    }))
})

router.get('/new', checkRole('TA'), (req, res, next) => {
  res.render('courses/new')
})

router.post('/new', checkRole('TA'), (req, res, next) => {
  const title = req.body.title;
  const teacher = req.body.teacher;
  const description = req.body.description;
  if (title === "") {
    res.render("courses/new", { message: "Indicate title" });
    return;
  }

  Course.findOne({ title }, "title", (err, user) => {
    if (user !== null) {
      res.render("courses/new", { message: "The course already exists" });
      return;
    }

    const newCourse = new Course({
      title: title,
      description: description,
      teacher: teacher,
    });

    newCourse.save()
      .then(() => {
        res.redirect("/courses");
      })
      .catch(err => {
        res.render("courses/new", { message: "Something went wrong" });
      })
  });
})

router.get('/:id/delete', checkRole('TA'), (req, res, next) => {
  Course.findByIdAndRemove(req.params.id)
    .then(course => {
      res.redirect('/courses')
    })
})


module.exports = router;