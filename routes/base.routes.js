const express = require('express')
const router = express.Router()

// const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You have to login' })
// const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'You have no rigths' })

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/profile', (req, res) => res.render('profile'))


module.exports = router
