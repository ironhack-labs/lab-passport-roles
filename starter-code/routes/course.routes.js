const express = require("express")
const passport = require("passport")
const ensureLogin = require("connect-ensure-login") // Asegurar la sesión para acceso a rutas
const Handlebars = require('handlebars')
const Swag = require('swag')
const router = express.Router()

const User = require("../models/user.model")
const Course = require("../models/course.model")

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.render('index', { msg: `Necesitas ser un ${role} para acceder aquí` })
    }
  }
}

router.get('/', (req, res, next) =>  res.render('courses'))

router.get('/new', checkRoles('TA'), (req, res, next) =>  res.render('new-course'))

router.post('/new', checkRoles('TA'), (req, res, next) => {
  let { name, duration } = req.body
  Course.create(new Course({name, duration}))
  .then(() => res.redirect('/course'))
  .catch(err => console.log(err))
})

router.post('/edit', checkRoles('TA'), (req, res, next) => {
  const { name, duration } = req.body

  Course.update({_id: req.body.courseID}, { $set: {name, duration}})
  .then(() => res.redirect('/course/'))
  .catch((error) => console.log(error))
})




module.exports = router