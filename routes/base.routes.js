const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })
// Endpoints
router.get('/', (req, res) => res.render('index'))
//router.get('/boss-zone', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('boss', { res.render('auth/profile', { user: req.user,isBoss: req.user.role.includes('BOSS') }))

router.get('/boss', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('auth/boss', { user: req.user }))


module.exports = router

