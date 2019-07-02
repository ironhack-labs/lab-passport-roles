const passport = require('../middlewares/passport')
const { Router } = require('express')
const authRoutes = Router()
const {getSignup, getLogin, getLogout, postSignup, postLogin} = require('../controllers/auth.controller')


// Listo
authRoutes.get('/signup', getSignup)
authRoutes.post('/signup', postSignup)

// Listo
authRoutes.get('/login', getLogin)
authRoutes.post('/login', passport.authenticate('local'), postLogin)

authRoutes.get('/logout', getLogout)
module.exports = authRoutes