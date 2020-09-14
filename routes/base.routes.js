const express = require('express')
const router = express.Router()

const passport = require("passport")

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

/* GET home page */
const checkLogIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })
// const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })

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
router.get('/', (req, res) => res.render('index'))
// router.get('/profile', checkRole(['BOSS']),(req, res, next) => res.render('auth/profile', req.user))

router.get('/profile', checkLogIn, checkRole(['BOSS']), (req, res, next) => res.render('auth/profile', { user: req.user.username, role: req.user.role }))
router.get('/crear', checkRole(['BOSS']), (req, res, next) => res.render('auth/crear', { role: req.user.role === 'BOSS' }))
router.post('/crear', (req, res, next) => {

    const { username, password, role } = req.body
    if (username === '' || password === '') {
        res.render('auth/crear', { message: 'Insert your username and password' })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/crear', { message: 'Username already exists' })
                return
            }

            const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptSalt))

            User.create({ username, password: hashPass, role })
                .then(() => res.render('auth/new-profile', ))
                .catch(error => next(error))
        })
        .catch(error => next(error))
})



// router.get('/view-documentation', checkRole(['Student', 'Teacher', 'Admin']), (req, res, next) => res.render('documentation', { user: req.user, isAdmin: req.user.role === 'Admin' }))
// router.get('/remove-documentation', checkRole(['Admin']), (req, res, next) => res.send('AQUÍ ESTÁ LA SUPRESIÓN DE LA DOCUEMNTACIÓN'))






module.exports = router;
