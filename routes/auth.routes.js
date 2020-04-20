const express = require('express');
const router = express.Router();
const passport = require('passport')

const User = require('../models/User.model')

const bcrypt = require("bcrypt")
const bcryptSalt = 10
    // add routes here

router.get('/login', (req, res) => res.render('auth/login', { 'errorMsg': req.flash('error') }))

router.post('/login', passport.authenticate('local', {

    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos'

}))




router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})


const checkRole = role => (req, res, next) => req.isAuthenticated() && req.user.role.includes(role) ? next() : res.render('index', { errorMsg: 'Área restringida' })

router.get('/signup', checkRole('BOSS'), (req, res) => res.render('auth/signup'))

router.post('/signup', checkRole('BOSS'), (req, res, next) => {
    const { username, name, password, profileImg, description, facebookId, role } = req.body

    if (!username || !name || !password ||  !description || !facebookId || !role) {
        res.render('auth/signup', { errorMsg: 'Rellena todos los campos' })
        return
    }



    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/signup', { errorMsg: 'El usuario ya existe' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, name, password: hashPass, profileImg, description, facebookId, role })
                .then(() => res.redirect('/'))
                .catch(() => res.render('auth/signup', { errorMsg: 'No se pudo añadir un nuevo empleado' }))
        })
        .catch(err => next(err))

})





module.exports = router;