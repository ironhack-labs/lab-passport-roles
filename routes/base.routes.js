const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Restricted area, please, log in.' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Restricted area, you are not allowed in.' })


// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/profile', ensureAuthenticated, (req, res) => res.render('auth/profile', { user: req.user, isBoss: req.user.role.includes('BOSS') }))
router.get('/edit-profile', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA']), (req, res) => res.render('auth/edit'))

module.exports = router
