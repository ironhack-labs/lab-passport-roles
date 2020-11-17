const express = require('express');
const router = express.Router();
const passport = require("passport")

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// MIDLEWARE
const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/signup', { errorMsg: 'Unauthorized, please login' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Unauthorized, you have no special rights' })

// BOSS SIGNUP
router.get("/signup", ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('auth/login', { user: req.user }))

router.post("/signup", ensureAuthenticated, checkRole(['BOSS']), (req, res, next) => {

    const { username, name, password, profileImg, description, role } = req.body  

    if (username === "" || name === "" || password === "" || profileImg === ""  || description === "" || role === "" ) {
        res.render("auth/signup", { errorMsg: "Fill all fields" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "User already exists" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, name, password: hashPass, profileImg, description, role })
                .then(() => res.redirect('/login'))
                .catch(() => res.render("auth/signup", { errorMsg: "There was an error" }))
        })
        .catch(error => next(error))
})

// BOSS LOGIN
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))


//USERS LIST
// router.get('/show', ensureAuthenticated, checkRole(['BOSS']), (req, res) => {

//     User
//         .find()
//         .then(allUsers => res.render("show", { allUsers }))
//         .catch(err => console.log(err))

// })

// router.get('/delete-user', (req, res) => {

//     const userId = req.query.user_id

//     User
//         .findByIdAndDelete(userId)
//         .then(() => res.redirect('/show'))
//         .catch(err => console.log(err))
// })


// LOGOUT
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router;