const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Not authorized, please log in' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Not authorized, you need a permit' })

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/profile', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render('profile', { user: req.user, isBoss: req.user.role.includes('BOSS') }))
router.get('/edit-content', ensureAuthenticated, checkRole(['BOSS', 'ADMIN']), (req, res) => res.render('context-editor', { user: req.user, isBoss: req.user.role.includes('BOSS') }))



module.exports = router
