const express = require('express')
const router = express.Router()


const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Restricted area, please login' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Not allowed' })

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/profile', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render('profile', { user: req.user, isAdmin: req.user.role.includes('BOSS') }))
// router.get('/edit-content', ensureAuthenticated, checkRole(['EDITOR', 'ADMIN']), (req, res) => res.render('context-editor', { user: req.user }))
router.get('/admin-zone', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('admin', { user: req.user }))

module.exports = router
