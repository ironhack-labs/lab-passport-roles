const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })
// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/sign-up', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('auth/signup', { user: req.user }))
router.get('/platform', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('platform/admin', { user: req.user }))
 router.get('/platform/profile/:user_id', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA']), (req, res) => res.render('platform/profile', { user: req.user, isAdmin: req.user.role.includes('BOSS') }))
router.get('/platform/profile/:user_id', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA']), (req, res) => res.render('platform/profile', { user: req.user, isUserId: req.user.id === req.params.user_id }))

module.exports = router
