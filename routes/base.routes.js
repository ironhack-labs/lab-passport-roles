const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })

// Endpoints
router.get('/', (req, res) => res.render('index'))


router.get('/profile', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render('profile', { user: req.user}))

router.get('/users', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render('admin', { user: req.user }))

router.get('/employees', ensureAuthenticated, checkRole('BOSS'), (req, res) =>
    res.render('employees', { user: req.user })
)

module.exports = router