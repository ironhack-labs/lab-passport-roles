// routes/auth-routes.js
const express = require("express");
const router = express.Router();

const passport = require("passport");
const ensureLogin = require("connect-ensure-login");



// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


//SIGNUP
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.render("auth/signup", { message: "Introduce un usuario y contraseña" });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { message: "El usuario ya existe, merluzo" });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({ username, password: hashPass })
                .then(x => res.redirect("/"))
                .catch(x => res.render("auth/signup", { message: "Algo fue mal, inténtalo más tarde. Oopsy!" }))
        })
        .catch(error => { next(error) })
});

//LOGIN
router.get("/login", (req, res, next) => { res.render("auth/login"), {"message": req.flash("error")}});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));


//LOGOUT
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});



//AUTENTIFICACIÓN
//La función ensureLoggedIn() redirige por defecto al usuario a la página /login si no ha iniciado sesión
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("private", { user: req.user });
});

module.exports = router;