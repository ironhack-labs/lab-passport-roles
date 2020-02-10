const express = require("express");
const roleRouter = express.Router();
// Require user model
const User = require("../models/user.model.js")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10
// Add passport 
const passport = require("passport")

const ensureLogin = require("connect-ensure-login");

const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", {
    errorMessage: "No tienes permisos para acceder aquí"
})



roleRouter.get("/createUser", checkRole(['Boss']), (req, res) => {
    res.render("passport/signup")
})

roleRouter.post("/createUser", checkRole(['Boss']), (req, res, next) => {
    const {
        username,
        password,
        role
    } = req.body
    console.log(`se crea la cuenta,${username}`)
    if (username === "" || password === "") {
        res.render("passport/signup", {
            errorMessage: "rellene los campos"
        })
        return
    }

    User.findOne({
            username: username
        })
        .then(searchName => {
            if (searchName) {
                res.render("passport/signup", {
                    errorMessage: "El usuario ya existe"
                })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({
                    username,
                    password: hashPass,
                    role
                })
                .then(createAccount => {
                    console.log("Cuenta creada", createAccount)
                    res.redirect("/")
                })
                .catch(err => console.log("Error al crear nuevo usuario", err))
            next(err)
        })
})

roleRouter.get("/login", (req, res) => res.render("passport/login", {
    errorMessage: req.flash("error")
}))

roleRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

roleRouter.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

module.exports = roleRouter;