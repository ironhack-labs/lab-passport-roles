const express = require('express')
const router = express.Router()

const User = require('./../models/user.model')



// Endpoints


// Listado de users
router.get('/lista-de-users', (req, res) => {

    User
        .find({}, { title: 1 })                                             // BONUS: con proyección! (segundo argumento opcional de find())
        .sort({ title: 1 })                                                 // BONUS: ordenados por título!
        .then(allUsers => res.render('users/users-list', { llUsers }))     // es lo mismo que  { allBooks: allBooks }
        .catch(err => console.log(err))
})




// Detalle de user
router.get('/detalle/:user_id', (req, res) => {

    const userId = req.params.user_id

    User
        .findById(userId)
        .then(theUser => res.render('users/details', theUser))
        .catch(err => console.log(err))
})


// Formulario nuevo user: renderizar (GET)
router.get('/crear-usuario', (req, res) => res.render('users/create-user'))


// Formulario nuevo libro: gestionar (POST)
router.post('/crear-usuario', (req, res) => {

    const  { username, password, profileImg, description, facebookId, role } = req.body

    User
        .create({ username, password, profileImg, description, facebookId, role })
        .then(() => res.redirect('/users'))
        .catch(err => console.log('Error:', err))
})





// Formulario edición usuario: renderizar (GET)
router.get('/editar-empleados', (req, res) => {

    const userId = req.query.user_id

    User
        .findById(userId)
        .then(userInfo => res.render('users/content-editor', userInfo))
        .catch(err => console.log(err))
})



// Formulario edición usuario: gestionar (POST)
router.post('/editar-libro', (req, res) => {

    const userId = req.query.user_id                          

    const {  username, password, profileImg, description, facebookId, role  } = req.body     

    User
        .findByIdAndUpdate(userId, {  username, password, profileImg, description, facebookId, role })
        .then(userInfo => res.redirect('/users'))
        .catch(err => console.log(err))
})




// Eliminar usuario
router.get('/eliminar-usuario', (req, res) => {

    const userId = req.query.user_id

    User
        .findByIdAndDelete(userId)
        .then(() => res.redirect('/users'))
        .catch(err => console.log(err))
})




module.exports = router