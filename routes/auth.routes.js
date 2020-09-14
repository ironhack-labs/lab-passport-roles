const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })

//Login
router.get("/login", (req, res, next) => res.render("auth/login", { "message": req.flash("error") }))
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))



//Añadir botones de editar o eliminar usuarios solo para BOSS

// router.get("/signup", (req, res, next) => res.render("auth/signup"))

router.post("/signup",checkRole(['BOSS']),(req, res, next) => {
   
   
    const { username,name,password,profileImg,description,facebookId,role } = req.body
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

            User.create({ username,name,password: hashPass,profileImg,description,facebookId,role, })
                .then(() => res.redirect('/'))
                .catch(error => next(error))
        })
        .catch(error => next(error))
})

//Logout
router.get('/logout', (req, res, next) => {
    req.logout()
    res.render('auth/login', { message: 'Sesión cerrada' })
})


module.exports = router