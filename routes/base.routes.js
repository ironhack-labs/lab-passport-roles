const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Unauthorized, please login' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Unauthorized, you have no special rights' })

// Endpoints
router.get('/', (req, res) => res.render('home'))

router.get('/login', ensureAuthenticated, checkRole(['ADMIN']), (req, res) => res.render('users/show-all', { user: req.user }))
// router.get('/profile', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render('profile', { user: req.user, isAdmin: req.user.role.includes('BOSS') }))
// router.get('/edit-content', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render('content-editor', { user: req.user }))
// router.get('/admin-zone', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('admin', { user: req.user }))


module.exports = router
