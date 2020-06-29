const express = require('express');
const router = express.Router();

const passport = require('passport')

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10


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

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            return User.create({ username, password: hashPass })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log("Error!:", err))
        .catch(err => console.log("Error!:", err))
})


// Login
router.get('/login', (req, res) => res.render('auth/login', { "message": req.flash("error") }))

router.post('/login', passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))


// Logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


// Logged in checker middleware
const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')




// // Role checker middleware

const checkBoss = user => user.role === 'BOSS'

const checkNoBoss = user => user.role !== 'BOSS'


const checkRole = rolesToCheck => (req, res, next) => {
    return req.isAuthenticated() && roles.includes(req.user.role) ? next() : res.render("auth/login", { message: "Fuera de aquí" })
}

// const checkEdit = user => (req, res, next) => {

//     if (user._id === req.params.id) {
//         next()
//     }
// }

const checkEdit = user => (req, res, next) => user._id === req.params.id




// Check logged in session 
router.get('/profile', checkAuthenticated, (req, res, next) => {
    // console.log("ENTRASTE EN PROFILE")
    // res.render('auth/profile', { user: req.user })
    User
        .find()
        .then(allUsers => {
            res.render('profile', { allUsers, checkBoss: checkBoss(req.user), checkId: checkEdit(req.user) })
            console.log(checkEdit)
        })
        .catch(err => console.log("Error en devolviendo bbdd", err))
})

// Check logged in session 
router.get('/profile/:i', (req, res, next) => {
    // console.log("ENTRASTE EN PROFILE")
    // res.render('auth/profile', { user: req.user })
    User
        .findById(req.params.id)
        .then(user => {
            console.log("entras=?")
            res.render('profileGuest', user)
        })
        .catch(err => console.log("Error en devolviendo bbdd", err))
})


// Check logged in session & roles
router.get('/profile', checkRole(['BOSS']), (req, res) => res.send('AQUÍ ESTÁ EL PODER'))


module.exports = router;


