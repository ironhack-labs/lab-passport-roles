const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10


const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', {
    message: 'Desautorizado, incia sesión para continuar'
})

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        } else {
            res.render('auth/login', {
                message: 'Desautorizado, no tienes permisos para ver eso.'
            })
        }
    }
}


router.get("/signup", checkLoggedIn, checkRole(['BOSS']),(req, res, next) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    const { username, password, role } = req.body

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

            User.create({ username, password: hashPass, role })
                .then(() => res.redirect('/'))
                .catch(error => next(error))
        })
        .catch(error => next(error))
})

router.get("/login", (req, res, next) => res.render("auth/login", { "message": req.flash("error")}))
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(userDetails => res.render('user-edit-form', userDetails))
        .catch(err => console.log(err))
})
router.post('/edit/:id', (req, res) => {
    const id = req.params.id
    const { username } = req.body

    User.findByIdAndUpdate(id, { username})
        .then(() => res.redirect('/profile'))
        .catch(err => console.log(err))
})








module.exports = router