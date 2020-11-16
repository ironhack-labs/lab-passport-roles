const express = require('express')
const router = express.Router()

//middleWares
const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })

// Endpoints
router.get('/', (req, res) => res.render('index')) //no del todo seguro de necesitarlo


module.exports = router
