const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../models/User.model.js')

const passport = require('passport')
const ensureLogin = require('connect-ensure-login');

const checkRole = role => (req, res, next) => req.isAuthenticated() && req.user.role.includes(role) ? next() : res.render('auth/login', { errorMsg: 'Restricted Zone' })


//Sign Up
router.get('/signup', checkRole('BOSS'), (req, res) => res.render('auth/signup', { user: req.user }))

router.post("/signup", (req, res, next) => {

    const { username, name, profileImg, password } = req.body

    if (!username || !password) {
        res.render("auth/signup", { errorMsg: "Username and Password are required" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "Username already exists" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass, name, profileImg })
                .then(() => res.redirect("/"))
                .catch(() => res.render("auth/signup", { errorMsg: "An error occurred while registering the new user" }))
        })
        .catch(error => next(error))
})

//Log In
router.get('/login', (req, res) => res.render('auth/login', { "errorMsg": req.flash("error") }))

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Username and password fields must be filled'
}))

module.exports = router
