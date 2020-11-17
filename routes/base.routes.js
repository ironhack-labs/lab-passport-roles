const express = require('express')
const router = express.Router()


const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
//const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })

// Endpoints
router.get('/', (req, res) => res.render('index', { isIn: req.isAuthenticated() }))

router.get('/profiles', ensureAuthenticated, (req, res) => res.render('profile', { user: req.user, isBoss: req.user.role.includes('BOSS'), isTa: req.user.role.includes('TA')}))

//router.get('/take-action', ensureAuthenticated, (req, res) => res.render('possible-actions', { user: req.user, isBoss: req.user.role.includes('BOSS'), isDev: req.user.role.includes('DEV'), isTa: req.user.role.includes('TA'), isStudent: req.user.role.includes('STUDENT'), isGuest: req.user.role.includes('GUEST') }))


module.exports = router
