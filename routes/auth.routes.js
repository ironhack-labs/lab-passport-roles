const express = require('express') 
const router = express.Router() 
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const passport = require('passport')
const session = require('express-session')

const ensureLogin = require('connect-ensure-login') 
const checkRole = role => (req, res, next) => req.isAuthenticated() && role.includes('BOSS') ? next() : res.render('passport/boss', { roleErrorMessage: `Necesitas ser  ${role} para acceder aquí` })
const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('index', { loginErrorMessage: 'Acceso restringido' })

router.get('/boss', checkRole, (req, res) => res.render("boss", { user: req.user }))

router.get('/signup', (req, res, next) => res.render("auth-views/signup"))

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.render('auth-views/signup', { errorMsg: "Rellena Usuario y Contraseña" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth-views/signup', { errorMsg: "El usuario ya existe" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render('auth-views/signup', { errorMsg: "No se pudo crear al usuario" }))
        })

        .catch(err => next(err))
})



router.get('/login', (req, res) => res.render('auth-views/login', { 'errorMsg': req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos'
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

module.exports = router
