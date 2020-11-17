const express = require('express');
const router = express.Router();
const passport = require("passport")
const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10

router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs')
})

router.get('/login', (req, res) => {
    res.render('auth/login.hbs')
})

router.post('/signup', (req, res)=> {
    
    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario ya existe" })
                return
            }

            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "Hubo un error" }))
        })
        .catch(error => next(error))
})

// Inicio sesión (renderizado formulario)
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

// Inicio sesión (gestión)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))


// Cerrar sesión
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router;