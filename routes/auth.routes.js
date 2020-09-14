const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10


//Signup
router.get("/signup", (req, res, next) => res.render("auth/signup-form"))
router.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup-form", { message: "Indicate username and password" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup-form", { message: "The username already exists" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass})
                .then(() => res.redirect('/'))
                .catch(error => next(error))
        })
        .catch(error => next(error))
})

//Login
router.get("/login", (req, res) => res.render("auth/login-form", { "message": req.flash("error") }))
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")
})

//Employees
router.get('/employees', (req, res, next) => {

    User.find()
    .then(users => res.render('auth/employees'), { users}) 
    .catch(err => next(err))
})

//Adding employees
router.get('/add-employees', (req, res) => res.render('auth/add-employees'))
router.post('/add-employees', (req, res) => {

    const { username, password, role } = req.body

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User.create({ username, password: hashPass, role })
    .then(() => res.redirect('/employees'))
    .catch(err => next(err))
})



//deleting employees


// Logout
router.get('/logout', (req, res, next) => {
    req.logout()
    res.render('auth/login', { message: 'Sesión cerrada' })
})

module.exports = router