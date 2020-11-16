const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcryptjs")
const bcryptSalt = 10

//midlewares permisos
const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })


//login BOSS
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))



//Signup realizado por BOSS

router.get('/signup', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('auth/signup', { user: req.user }))

router.post("/signup", ensureAuthenticated, checkRole(['BOSS']), (req, res, next) => {

    const { username, name, password, profileImg, description, role } = req.body
    //const { user } = req.user

    if (username === "" || name === "" || password === "" || profileImg === ""  || description === "" || role === "" ) {
        res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario ya existe" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, name, password: hashPass, profileImg, description, role })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "Hubo un error" }))
        })
        .catch(error => next(error))
})


//lista usuarios

router.get('/show', ensureAuthenticated, checkRole(['BOSS']), (req, res) => {


    User
        .find()
        .then(allUsers => res.render("users/show", { allUsers }))
        .catch(err => console.log(err))

})

router.get('/delete-user', (req, res) => {

    const userId = req.query.user_id

    User
        .findByIdAndDelete(userId)
        .then(() => res.redirect('/show'))
        .catch(err => console.log(err))
})






//Cerrar sesion
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})




module.exports = router