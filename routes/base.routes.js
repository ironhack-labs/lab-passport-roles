const express = require('express')
const router = express.Router()

// Logged in checker middleware
const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

// Role checker middleware
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.redirect('/login')

// Alternativa para enviar a la vista en el renderizado
const checkAdmin = () => req.user.role.includes('BOSS')          // Alternativa


// Endpoints
router.get('/boss', (req, res) => {
    console.log('¿Está el usuario logeado?', req.isAuthenticated())
    res.render('profile/boss')
})


// Check logged in session 
router.get('/profile', checkAuthenticated, (req, res) => res.render('profile/profile', { user: req.user }))


// Check logged in session & roles
router.get('/boss', checkRole(['BOSS']), (req, res) => res.send('AQUÍ VAN TODAS LAS HABITACIONES PARA BOSS'))



module.exports = router