const express = require('express')
const router = express.Router()
const User = require("./../models/user.model")

// Listado usuarios
// router.get('/', (req, res) => {
  
//   User
//     .find()
//     .then(allUsers => res.render("boss/user-list",{allUsers}))
//   .catch(err=>console.log(err))
// })

// Formulario nuevo usuario: renderizar (GET)
router.get('/boss', (req, res) => {

  //res.send("hkwfjbf")

    res.render("auth/boss")
  
})

// Formulario nuevo usuario: gestionar (POST)
router.post('/boss', (req, res) => {

    const { username, role} = req.body

    User
        .create({ username, role})
        .then(() => res.redirect('/boss/user-list'))
        .catch(err => console.log('Error:', err))
})

// Eliminar usuario
router.post('/:_id/delete', (req, res) => {

  const UserId = req.params._id

    User
        .findByIdAndDelete(MovieId)
        .then(() => res.redirect('/boss'))
        .catch(err => console.log(err))
})