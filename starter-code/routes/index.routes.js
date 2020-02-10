const express = require('express')
const router = express.Router()
const User = require('../models/user.model')

// Renderizar contenido despendiendo del rol, en la vista
const isAdmin = user => user && user.role === 'BOSS'

// Comprobar si un usuario tiene la sesión inciada
const checkLoggedIn = (req, res, next) => req.user ? next() : res.render('index', { loginErrorMessage: 'Zona restringida a usuarios registrados' })

router.get('/', (req, res) => res.render('index', { isAdmin: isAdmin(req.user) }))

router.get('/profile', checkLoggedIn, (req, res) => res.render('profile', { user: req.user }));

router.get('/user-list', (req, res) => {
  User.find()
    .then(allUsers => res.render('/user-list', { users: allUsers }))
    .catch(err => console.log('Error consultando la BBDD: ', err))
})

module.exports = router
