const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/plataforma', ensureAuthenticated, checkRole(['GUEST', 'BOSS', 'DEV', 'TA', 'STUDENT']), (req, res) => res.render('platform/platform', { user: req.user, isAdmin: req.user.role.includes('ADMIN') }))
router.post("/registro", ensureAuthenticated, checkRole([ 'BOSS']), (req, res) => res.render("auth/signup"))

module.exports = router
