const express = require("express")
const passportRouter = express.Router()
const User = require('../models/User')
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const passport = require("passport")
const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => res.render("passport/private", { user: req.user }))

passportRouter.get("/signup", (req, res) => res.render("passport/signup"))
passportRouter.post("/signup", (req, res, next) => {
    const { username, password } = req.body
    if (username.length === 0 || password.length === 0) {
        const data = { errorMsg: 'Please fill all the fields' }
        res.render('passport/signup', data)
        return
    }
    User.findOne({ "username": username })
        .then(user => {
            if (user !== null) {
                res.render("passport/signup", { errorMsg: "The username already exists!" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
            User.create({ username, password: hashPass })
                .then(() => res.redirect("/"))
                .catch(error => console.log(error))
        })
})

passportRouter.get("/login", (req, res, next) => res.render("passport/login", { "message": req.flash("error") }))
passportRouter.post("/login", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", failureFlash: true, passReqToCallback: true }))

passportRouter.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = passportRouter