const express = require('express')
const router = express.Router()

const User = require('../models/User.model')


// Listado de developers
router.get('/list', (req, res, next) => {
  User.find({})
    .then(allTheDevelopers => res.render('developers-list', { users: allTheDevelopers }))  // ojo! pasar obj
    .catch(err => console.log('Hubo un error:', err))
})


// Añadir developers
router.get('/create', (req, res, next) => res.render('developers-add'))
router.post('/create', (req, res, next) => {

  const { username, password } = req.body

  User.create({ username, password })
    .then(() => res.redirect('/developers/list'))
    .catch(err => console.log('Hubo un error:', err))
})

// Edición de datos
router.get('/edit', (req, res, next) => {
  User.findById(req.query.userId)
    .then(theUser => res.render('developers-edit', { theUser }))
    .catch(err => console.log('Hubo un error:', err))
})
router.post('/edit', (req, res, next) => {

  const { username, password } = req.body

  // Todos los métodos de actualizar pueden recibir {new: true} como último argumento opcional, retornando el nuevo elemento y no el previo al update
  User.findByIdAndUpdate(req.query.userId, { $set: { username, password } }, { new: true })
    .then(theNewUser => {
      console.log(theNewUser)
      res.redirect('/developers/list')
    })
    .catch(err => console.log('Hubo un error:', err))
})

// Eliminar alumno
router.get('/delete', (req, res, next) => {
  //console.log(req.query)
  User.findById(req.query.userId)
    .then(theUser => res.render('developers-delete', { theUser }))
    .catch(err => console.log('Hubo un error:', err))
})
router.post('/delete', (req, res, next) => {

  const { username, password } = req.body

  User.findByIdAndRemove(req.query.userId, { $set: { username, password } })
    .then(theNewUser => {
      console.log(theNewUser)
      res.redirect('/developers/list')
    })
    .catch(err => console.log('Hubo un error:', err))
})


module.exports = router