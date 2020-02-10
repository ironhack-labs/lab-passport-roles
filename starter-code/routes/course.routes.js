const express = require('express')
const router = express.Router()

const User = require("../models/user.model")
const Course = require("../models/course.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport");

// COMPROBAR SI ES TA
const checkTACourse = (req, res, next) => req.user.role === "TA" || req.user.role === "Boss" ? next() : res.render('index')

// GO TO ADD COURSE
router.get('/addCourse', checkTACourse, (req, res) => res.render('course/add'))

// ADD COURSE
router.post('/addCourse', checkTACourse, (req, res) => {
  Course.create(req.body)
    .then(() => res.redirect('/user/panel'))
    .catch(err => console.log(`Fallo al introducir curso en la base de datos ${err}`))
})

// DELETE COURSE
router.post('/delete/:id', checkTACourse, (req, res) => {
  Course.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/user/panel'))
    .catch(err => console.log(`Fallo al introducir curso en la base de datos ${err}`))
})

// GO TO EDIT COURSE  
router.get('/edit/:id', checkTACourse, (req, res) =>
  Course.findById(req.params.id)
  .then(course => res.render('course/edit', course))
  .catch(err => console.log(`Fallo al buscar el curso en la base de datos ${err}`))
)

// EDIT COURSE
router.post('/edit/:id', checkTACourse, (req, res) =>
  Course.findByIdAndUpdate(req.params.id, req.body)
  .then(() => res.redirect('/user/panel'))
  .catch(err => console.log(`Fallo al editar el curso en la base de datos ${err}`))
)

module.exports = router