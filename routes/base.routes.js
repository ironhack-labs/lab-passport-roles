const express = require('express')
const router = express.Router()


// const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You must log in to be enter!' })
// const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'You dont have permission, sorry' })


// Endpoints
router.get('/', (req, res) => res.render('index'))

// router.get('/signup', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('auth/signup', { user: req.user }))






module.exports = router
