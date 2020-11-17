const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })


// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/perfil', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'GUEST']), (req, res) => res.render('profile', { user: req.user, isBoss: req.user.role.includes('BOSS') }))
router.get('/editar-empleados', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('users/content-editor', { user: req.user }))
router.get('/crear-usuario', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('users/create-user', { user: req.user }))
router.get('/lista-de-users', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'GUEST']), (req, res) => res.render('users/users-list', { user: req.user, isBoss: req.user.role.includes('BOSS') }))


module.exports = router
