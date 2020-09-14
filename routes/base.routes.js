const express = require('express')
const User = require('../models/user.model')
const router = express.Router()


const checkLoggedIn = (req, res ,next) => req.isAuthenticated() ? next() : res.render('auth/login-form', { message: 'Desautorizado'})

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if(req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        } else {
            res.render('auth/login-form', { message: ' Desautorizado, no tienes permisos para ver esto.'})
        }
    }
}

// Endpoints
router.get('/',(req, res) => res.render('index'))
//router.get('/', checkLoggedIn, checkRole(['BOSS']), (req, res, next) => res.render('index'))
router.get('/signup', checkRole(['BOSS']), (req, res, next) => res.render('auth/signup'))

router.get('/employees', checkLoggedIn, checkRole(['BOSS', 'STUDENT','DEV', 'TA', 'GUEST' ]), (req, res, next) =>  res.render('auth/employees'))

router.get('/add-employees', checkLoggedIn, checkRole(['BOSS']), (req, res, next) => res.render('auth/add-employees'))


router.get('/login', checkRole(['BOSS', 'STUDENT','DEV', 'TA', 'GUEST']),(req, res) => res.render('auth/login'))
router.get('/profile', checkLoggedIn, (req, res, next) => res.render ('auth/profile', req.user))
module.exports = router
