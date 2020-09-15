const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Signup 
router.get("/signup", (req, res, next) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    const { username, password, roles } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", { message: "Indicate username and password" })
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

            User.create({ username, password: hashPass, roles })
                .then(() => res.redirect('/'))
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


//Profile edit
router.get('/profile', (req, res) => {

    const user_id = req.query.user_id

    Book.findById(user_id)
        .then(editUsername => res.render('profile', editUsername))
        .catch(err => console.log("ERRORR", err))
})

router.post('/profile/:user_id', (req, res) => {

    // No disponemos del ID en el formulario, por lo que lo obtenemos mediante Route Params
    const user_id = req.params.user_id

    const { username, password } = req.body

    Book.findByIdAndUpdate(user_id, { username, password })
        .then(() => res.redirect('/profile'))
        .catch(err => console.log("ERRORR", err))
})

module.exports = router