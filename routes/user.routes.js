const express = require('express');
const router = express.Router();
const passport = require("passport")

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('users/user-login', { errorMsg: 'Unauthorized, please login' })

// SIGNUP 
router.get("/signup-user", (req, res) => res.render("users/user-signup"))

router.post("/signup-user", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("users/user-signup", { errorMsg: "Fill all the fields" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("users/user-signup", { errorMsg: "User already exists" })
                return
            }

            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("users/user-signup", { errorMsg: "There was an error" }))
        })
        .catch(error => next(error))
})

// LOGIN
router.get("/login-user", (req, res) => res.render("users/user-login", { errorMsg: req.flash("error") }))

router.post("/login-user", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-user",
    failureFlash: true,
    passReqToCallback: true
}))

// LOGOUT
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login-user")
})

// PROFILE
router.get('/profile', ensureAuthenticated, (req, res) => res.render('users/profile', { user: req.user }))

router.get('/show-all', ensureAuthenticated, (req, res) => {

        User
            .find()
            .then(allUsers => res.render("users/show-all", { allUsers }))
            .catch(err => console.log(err))

})


module.exports = router;