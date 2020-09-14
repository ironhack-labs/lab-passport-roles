const express = require('express')
const User = require('../models/User.model')
const router = express.Router()


const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        } else {
            res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })
        }
    }
}

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/profile', checkLoggedIn, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render('profile',  {
    user: req.user,
    isBoss: req.user.role === 'BOSS'
}))

router.get('/user-list', checkLoggedIn, checkRole(["DEV", "TA"]), (req, res) => res.render('user-list', { user: req.user, isDev: req.user.role === 'DEV', isTa: req.user.role === 'TA' },))
router.get('/user-list', (req, res) => {
    User.find()
        .then(user => res.render('user-list', { user }))
        .catch(err => console.log(err))
})
module.exports = router
