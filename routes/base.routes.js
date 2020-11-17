const express = require('express')
const router = express.Router()
const User = require("../models/User.model")


const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })



// Endpoints
router.get('/', (req, res) => res.render('index'))



// Welcome
router.get('/welcome', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render("auth/welcome"))



// Añadir nuevo empleado (renderizar) (GET)
router.get('/add-empleados', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('auth/signup', { user: req.user }))



// Borrar perfiles (renderizar) (GET)
router.get('/borrar-perfiles', ensureAuthenticated, checkRole(['BOSS']), (req, res) => {
  User
    .find()
    .then(allUsers => res.render('user/delete', {
      allUsers
    }))
    .catch(err => console.log(err))
})



// Ver Perfiles
router.get('/ver-perfiles', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => {
  User
    .find()
    .then(allUsers => res.render('user/index', {
      allUsers
    }))
    .catch(err => console.log(err))
})



// Editar perfil (renderizar) (GET)
router.get('/edit', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => {

  const userId = req.user._id

  if (req.user.role === "BOSS") {

    User
      .findById(userId)
      .then(userInfo => res.render('user/edit-boss', userInfo))
      .catch(err => console.log(err))
    return

  } else {

    User
      .findById(userId)
      .then(userInfo => res.render('user/edit', userInfo))
      .catch(err => console.log(err))
    return
  }

})



module.exports = router