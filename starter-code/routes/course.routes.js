const express = require('express')
const router = express.Router()

const Course = require('../models/course.model')


// lista pelis
router.get('/courses-list', (req, res) => {
  Course.find()
    .then(allCourses => res.render('courses/courses-list', {
      courses: allCourses
    }))
    .catch(err => console.log("Error consultadno cursos en la BBDD: ", err))
})


// detalles peli
router.get('/courses-details/:theCourseIdFromTheURL', (req, res) => {

  const courseId = req.params.theCourseIdFromTheURL

  Course.findById(courseId)
    .then(theCourse => res.render('courses/courses-details', theCourse))
    .catch(err => console.log("Error consultando detalles del famoso en la BBDD: ", err))
})


// nueva peli
router.get('/courses-new', (req, res) => res.render('courses/courses-new'))
router.post('/courses-new', (req, res) => {

  const {
    name,
    instructions,

  } = req.body

  Course.create({
      name,
      instructions,
    })
    .then(() => res.redirect('/courses/courses-list'))
    .catch(err => console.log(err))
})

// Eliminar película
router.post('/courses-list/:id', (req, res) => {

  const id = req.params.id

  Course.findByIdAndDelete(id)
    .then((x) => res.redirect('/courses/courses-list'))
    .catch(err => console.log("ha ocurrido un error eliminando Course de la bbdd", err))
})


// Editar peli
router.get('/courses-edit', (req, res) => {

  const courseId = req.query.courseId
  console.log(req.query)
  Course.findById(courseId)
    .then(theCourse => res.render('courses/courses-edit', theCourse))

    .catch(err => console.log(err))
})
router.post('/courses-edit/:courseId', (req, res) => {
  const courseId = req.params.courseId
  console.log("EL Id del Course que llega como URL param es:", req.params.courseId)
  Course.findByIdAndUpdate(courseId, req.body, {
      new: true
    })
    .then(x => res.redirect(`../courses-details/${courseId}`))
    .catch(err => console.log(err))
})

module.exports = router