const express = require('express')
const router = express.Router()
const User = require("../models/user.model")


const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: "Desautorizado, no tienes permisos" })


// Endpoints
router.get('/', (req, res) => { res.render('index') })


router.get('/profile', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA']), (req, res) => res.render('profile', { user: req.user, isBoss: req.user.role.includes('BOSS') }))
router.get('//employees/delete/:id', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('profile'))
module.exports = router
