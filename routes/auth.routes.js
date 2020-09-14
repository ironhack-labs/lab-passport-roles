const express = require('express');
const router = express.Router();
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Signup
router.get("/signup", (req, res, next) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    const { username, name, password, profileImg, description, facebookId, role } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", { message: "Name and password, please" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { message: "The username already exists" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, name, password: hashPass, profileImg, description, facebookId, role })
                .then(() => res.redirect("/"))
                .catch(error => next(error))
        })
    .catch(error => next(error))
})

// Login
router.get("/login", (req, res, next) => res.render("auth/login", { "message": req.flash("error") }))
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

// Logout
router.get('/logout', (req, res, next) => {
    req.logout()
    res.render('auth/login', { message: 'Sesión cerrada' })
})

module.exports = router