const express = require('express')
const router = express.Router()


const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })





// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/signup',checkRole(['BOSS']),(req,res,next)=>res.render('auth/signup'))


module.exports = router
