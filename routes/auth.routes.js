const express = require('express');
const router = express.Router();
const passport = require('passport')

const User = require("../models/User.model")

const bcrypt = require('bcrypt')
const bcryptSalt = 10

// Registro de usuario con comprobacion de campos y encriptacion de password

router.get('/signup', (req, res) => res.render('auth/signup'))
router.post('/signup', (req, res, next) => {

    const { username, password } = req.body

    if(!username || !password) {
        res.render('auth/login', { errorMsg: 'Rellena el usuario y la contraseña'})
        return
    }

    User.findOne({username})
        .then(user => {
            if(user) {
                res.render('auth/signup', {errorMsg: 'El usuario ya existe'})
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({username, password: hashPass})
                .then(() => res.redirect('/'))
                .catch(() => res.render('auth/signup', {errorMsg: "No se pudo crear el usuario"}))
                
        })
        .catch(err => console.log(`Error al buscar nombre de usuario antes de crearlo ${err}`))
})

//Inicio de sesion con autentificacion

router.get('/login', (req, res) => res.render('auth/login', {errorMsg:req.flash('error')}))
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos'
}))

//Cierre de sesion
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
} )


module.exports = router;
