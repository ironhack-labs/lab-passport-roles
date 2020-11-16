const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require('../models/User.model')

const bcrypt = require("bcryptjs")
const bcryptSalt = 10



// Registro (renderizado formualrio)
router.get("/sign-up", (req, res) => res.render("auth/signup"))

// Registro (gestión)
router.post("/sign-up", (req, res, next) => {

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
router.get("/log-in", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

// Inicio sesión (gestión)
router.post("/log-in", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
    passReqToCallback: true
}))


// Cerrar sesión
router.get('/log-out', (req, res) => {
    req.logout()
    res.redirect("/log-in")
})


module.exports = router

