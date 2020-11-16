const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next(): res.render('auth/login', {errorMsg: "Desautorizado, inicia sesión"})
const cechrole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', {errorMsg: 'Desautorizado, no tienes permisos'})
// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/perfil', ensureAuthenticated, (req,res) => res.render('profile', {user: req.user}))
router.get('/signup', ensureAuthenticated, checkRole(['BOSS']), (req,res) => res.render('register', {user: req.user}))
router.get('/employees/edit', ensureAuthenticated, checkRole(['BOSS']), (req,res) => res.render('edit', {user: req.user}))


module.exports = router
