const express = require('express')
const router = express.Router()

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport");
const isBoss = (user) => user && user.role === "Boss"
const isEmployee = (user) => user && user.role === "TA" || user.role === "Developer" || user.role === "Boss"
// GO TO SIGNUP PAGE
router.get('/signup', (req, res) => {
    User.find()
        .then(users => res.render('auth/signup-form', {
            users: users,
            isBoss: isBoss(req.user),
            isEmployee: isEmployee(req.user)
        }))
        .catch(err => console.log(`Error al encontrar el usuario ${err}`))
})
// GO TO LOGIN PAGE
router.get('/login', (req, res) => res.render('auth/login-form', {
    message: req.flash("error")
}))

// LOGIN USER
router.post('/login', passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

// DELETE USER
router.post('/signup/:id/delete', (req, res) => User.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/signup'))
    .catch(err => console.log(`Error al borrar el usuario ${err}`))
)

// SIGNUP USER
router.post('/signup', (req, res) => {
    const {
        username,
        password,
        role
    } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup-form", {
            message: "Rellena los campos"
        })
        return
    }

    User.findOne({
            username
        })
        .then(user => {
            if (user) {
                res.render("auth/signup-form", {
                    message: "El usuario ya existe"
                })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({
                    username,
                    password: hashPass,
                    role
                })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup-form", {
                    message: "Something went wrong"
                }))
        })
        .catch(error => next(error))

})
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

module.exports = router