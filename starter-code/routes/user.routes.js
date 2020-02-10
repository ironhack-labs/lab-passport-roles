const express = require('express')
const router = express.Router()

const User = require("../models/user.model")
const Course = require("../models/course.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport");

// COMPROBAR SI EL USUARIO TIENE UNA SESION INICIADA
const checkLoggedIn = (req, res, next) => req.user ? next() : res.render('index', {
  loginErrorMessage: 'Acceso restringido'
})

// COMPROBAR SI ES BOSS
const checkBoss = role => role === "Boss" ? true : false

// COMPROBAR SI ES EMPLEADO
const checkEmployee = role => role === "TA" || role === "Developer" || role === "Boss" ? true : false

// COMPROBAR SI ES TA
const checkTA = role => role === "TA" || role === "Boss" ? true : false

// COMPROBAR SI ES ALUMNI
const checkAlumni = role => role === "Student" ? true : false

// PANEL DE USUARIO
router.get('/panel', checkLoggedIn, (req, res) => {
  User.find({
      role: "Student"
    })
    .then(alumnis => Course.find()
      .then(courses => User.find()
        .then(users => res.render('user/panel', {
          alumnis: alumnis,
          courses: courses,
          users: users,
          user: req.user,
          boss: checkBoss(req.user.role),
          employee: checkEmployee(req.user.role),
          ta: checkTA(req.user.role),
          alumni: checkAlumni(req.user.role)
        }))
        .catch(err => console.log(`Fallo al buscar el usuario en la base de datos ${err}`)))
      .catch(err => console.log(`Fallo al buscar el usuario en la base de datos ${err}`)))
    .catch(err => console.log(`Fallo al buscar el elumni en la base de datos ${err}`))
})

// DELETE USER
router.post('/:id/delete', (req, res) =>
  User.findByIdAndDelete(req.params.id)
  .then(() => res.redirect('/user/panel'))
  .catch(err => console.log(`Fallo al eliminar el usuario en la base de datos ${err}`))
)

// GO TO EDIT USER
router.get('/edit/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => res.render('user/edit', user))
})

// EDIT USER
router.post('/edit/:id/:role', (req, res) => {
  console.log(`Edit!!!! ${req.params.id, req.params.role}`)
  const {
    username,
    password
  } = req.body
  const role = req.params.role

  if (username === "" || password === "") {
    res.render(`user/edit`, {
      message: "Rellena los campos"
    })
    return
  }

  User.findOne({
      username
    })
    .then(user => {
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.findByIdAndUpdate(req.params.id, {
          username,
          password: hashPass,
          role
        })
        .then(() => res.redirect('/'))
        .catch(() => res.render(`user/edit`, {
          message: "Something went wrong"
        }))
    })
    .catch(error => next(error))
})

module.exports = router