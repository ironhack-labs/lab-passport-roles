const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const bcryptSalt = 10

const User = require('../models/user.model')

// Login
router.get('/login', (req, res, next) => res.render("auth/login", { "message": req.flash("error") }))
router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))


// Create user
router.post('/add-user', (req, res, next) => {

    const { username, name, password, facebookId, role, description } = req.body

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('/add-user', { message: 'The username already exists' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, name, password: hashPass, facebookId, role, description })
                .then(() => res.redirect('/'))
                .catch(err => next(err))

        })
})



// Logout
router.get('/logout', (req, res, next) => {
    req.logout()
    res.render('auth/login', { message: 'Bye, see you later!' })
})



module.exports = router