const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10
// Add passport
const passport = require('passport')

const ensureLogin = require('connect-ensure-login');

router.get('/profile', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('passport/profile', { username: req.user });
});


router.get("/signup", (req, res) => res.render("user/signup"))
router.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render("user/signup", { errorMsg: "Rellena el usuario y la contraseña" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("user/signup", { errorMsg: "El usuario ya existe en la BBDD" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect("/"))
                .catch(() => res.render("user/signup", { errorMsg: "No se pudo crear el usuario" }))
        })
        .catch(error => next(error))
})

router.get('/login', (req, res) => res.render('user/login', { "errorMsg": req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos'
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

module.exports = router;
