const express = require('express');
const router = express.Router();
const session = require("express-session")
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy
const flash = require("connect-flash")




const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");
const bcryptjsSalt = 10;


// Signup


router.get("/signup", (req, res) => res.render("auth/signup"))

router.post("/signup", (req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", { errorMsg: "Rellena los campos, ¡vago!" });
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "Usuario ya existente" });
                return
            }

            const salt = bcryptjs.genSaltSync(bcryptjsSalt)
            const hashPass = bcryptjs.hashSync(password, salt)

            return User.create({ username, password: hashPass })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log("Error!:", err))
        .catch(err => console.log("Error!:", err))
})




// Login
router.get('/login', (req, res) => res.render('auth/login', { "message": req.flash("error") }))

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))


// Check roles


const checkRole = roles => (req, res, next) => req.isAuthenticated() && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })

router.get('/profileGuest', checkRole(['GUEST', 'STUDENT', 'DEV', 'TA', 'BOSS']), (req, res) => res.render('auth/profileGuest'))
router.get('/profileStudent', checkRole(['STUDENT', 'TA', 'DEV', 'BOSS']), (req, res) => res.render('auth/profileStudent'))
router.get('/profileDEV', checkRole(['DEV', 'BOSS']), (req, res) => res.render('auth/profileDEV'))
router.get('/profileTA', checkRole(['TA', 'BOSS']), (req, res) => res.render('auth/profileTA'))
router.get('/private', checkRole(['BOSS']), (req, res) => res.render('auth/private'))




// Logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


// add routes here

module.exports = router;
