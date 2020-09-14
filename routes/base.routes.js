const express = require('express')
const router = express.Router()
const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        }
        else {
            res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })
        }
    }
}

// Endpoints
router.get('/', checkLoggedIn, checkRole(["BOSS", "DEV", "TA", "STUDENT", "GUEST"]), (req, res, next) => res.render('index'))
router.get('/signup', checkLoggedIn, checkRole(["BOSS"]), (req, res, next) => res.render('auth/signup'))

module.exports = router
