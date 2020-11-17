const express = require('express')
const { use } = require('passport')
const User = require('../models/user.model')
const router = express.Router()

const sessionAuth = (req, res, next) => req.sessionAuth() ? next() : res.render('auth/login', { msg: 'Unathorized, sign in' })
const roleCheck = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { msg: 'Unathorized, not enough privileges' })


// Endpoints
router.get('/', (req, res) => res.render('index'))

// User Roles
router.get('/private', sessionAuth, (req, res) => res.render('auth/private', { user: req.user }))





module.exports = router
