const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcryptjs = require("bcryptjs")
const bcryptSalt = 10

// Registro (renderizado formualrio)
router.get("/signup", (req, res) => res.render("auth/signup"))

// Registro (gestión)
router.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Fill in all the information" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "User already exists" })
                return
            }

            // Other validations
            const salt = bcryptjs.genSaltSync(bcryptSalt)
            const hashPass = bcryptjs.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "Error" }))
        })
        .catch(error => next(error))
})

// Inicio sesión (renderizado formulario)
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

// Inicio sesión (gestión)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get('/close', (req, res) => {
    req.logout()
    res.redirect("/login")
})


module.exports = router
