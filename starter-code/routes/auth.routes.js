const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login") // Asegurar la sesión para acceso a rutas
const session = require('express-session');

const authRoutes = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10



authRoutes.get("/signup", (req, res, next) => res.render("passport/signup"))
authRoutes.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("passport/signup", { message: "Rellena todo" });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("passport/signup", { message: "El usuario ya existe" });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                username,
                password: hashPass
            });

            newUser.save((err) => {
                if (err) {
                    res.render("passport/signup", { message: "Something went wrong" });
                } else {
                    res.redirect("/");
                }
            });

        })
        .catch(error => {
            next(error)
        })
});


authRoutes.get("/login", (req, res, next) => {
    res.render("passport/login", { "message": req.flash("error") });
})

authRoutes.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});


authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => res.render("private", { user: req.user }))

module.exports = authRoutes;