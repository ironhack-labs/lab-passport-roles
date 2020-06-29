const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require("../models/User.model")

// Logged in checker middleware
const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

// Role checker middleware
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.redirect('/login')


// Alternativa para enviar a la vista en el renderizado
const ifBoss = user => user.role === "BOSS"
const checkBoss = () => req.user.role.includes('BOSS')
const checkDev = () => req.user.role.includes('DEV')
const checkTa = () => req.user.role.includes('TA') 
const checkStudent = () => req.user.role.includes('STUDENT')  
const checkGuest = () => req.user.role.includes('GUEST')

// Endpoints
router.get('/', (req, res) => {
    console.log('¿Está el usuario logeado?', req.isAuthenticated())
    res.render('index')
})

router.get('/list', (req, res) => {
    User
        .find()
        .then(allEmployees => res.render('list', {allEmployees, ifBoss: ifBoss(req.user)}))
        .catch(err => console.log('Error al acceder a la BD: ', err))
})

// Check logged in session 
router.get('/profile', checkAuthenticated, (req, res) => res.render('profile', { user: req.user }))

// Check logged in session & roles

router.post('/edit/:id', checkRole(['BOSS']), (req, res) => {
    User
        .findById(req.params.id)
        .then(employee => res.render('edit', employee))
        .catch(err => console.log('Error al acceder al perfil del empleado: ', err))
})


// router.get('/rooms', checkRole(['GUEST', 'EDITOR', 'ADMIN']), (req, res) => res.send('AQUÍ VAN LAS HABITACIONES PARA GUEST'))
// router.get('/edit-rooms', checkRole(['GUEST', 'EDITOR']), (req, res) => res.send('AQUÍ VAN TUS HABITACIONES PARA EDITOR'))
// router.get('/all-rooms', checkRole(['ADMIN']), (req, res) => res.send('AQUÍ VAN TODAS LAS HABITACIONES PARA ADMIN'))



module.exports = router