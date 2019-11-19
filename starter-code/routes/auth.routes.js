const express = require('express')
const router = express.Router()
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')


const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;


//---SIGNUP FORM RENDER---//
router.get("/signup", (req, res) => res.render("auth/signup"));

//---SIGNUP SEND FORM---//
router.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render("auth/signup", { message: "Introduce un usuario y contraseña" });
        return;
    }

    User.findOne({ username })

        .then(user => {
            if (user) {
                res.render("auth/signup", { message: "El usuario ya existe" });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({ username, password: hashPass })
                .then(x => res.redirect("/"))
                .catch(x => res.render("auth/signup", { message: "Algo fue mal, Oopsy!" }))
        })
        .catch(error => { next(error) })
});

//---LOGIN FORM RENDER---//
router.get("/login", (req, res) => res.render("auth/login", {
    "message": req.flash("error")
}));

//---LOGIN SEND FORM---//
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

//---PRIVATE PAGE---//
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => res.render("private", {
    user: req.user
}));

//---LOGOUT---//
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router;