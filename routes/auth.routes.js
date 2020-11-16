const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

router.get("/sign-up", (req, res) => res.render("auth/signup"))
router.post("/sign-up", (req, res, next) => {

    const { username, password, role } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Fill the fields" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "this user already exists" })
                return
            }

            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass, role})
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "Error" }))
        })
        .catch(error => next(error))
})
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

// Inicio sesión (gestión)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get('/log-out', (req, res) => {
    req.logout()
    res.redirect("/login")
})


module.exports = router

