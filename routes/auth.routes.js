const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User.model')

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Endpoints
router.get('/register', (req, res) => res.render('auth/sign-up'))

router.post('/register', (req, res, next) => {

    const { username, password } = req.body

    // If some field is empty
    if (!username.length || !password.length) {

        res.render('auth/sign-up', { message: 'Rellene todos los campos por favor' })

        return
    }

    // We verify that this username is not already in use
    User.findOne({ username })
        .then(matchedUser => {

            if (matchedUser) { // Si ya existe un usuario con este username, expulsamos
                res.render('auth/sign-up', { message: 'Usuario ya registrado' })
                return
            }

            // Encryptamos la contraseña
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            // We create the user and redirect him to the employees index
            User.create({ username, password: hashPass })
                .then((newUser) => res.redirect(`/employees/profile/${newUser.id}`))
                .catch(err => console.log(err))

        })
        .catch(error => console.log('ERROR: ', error))

})

router.get("/login", (req, res, next) => {

    let message
    req.user ? message = '' : message = req.flash("error")

    res.render("auth/login", { message })

})

router.post("/login", passport.authenticate("local", {
    successRedirect: `/employees/profile`,
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
}))


router.get('/logout', (req, res) => {

    req.logOut()
    res.redirect('login')

})


module.exports = router