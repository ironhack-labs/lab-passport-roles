const express = require('express');
const router = express.Router();
const passport = require("passport")
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10


router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        res.render("auth/signup", { errorMsg: "Fill the form" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "the user already exists in the database" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect("/"))
                .catch(() => res.render("auth/signup", { errorMsg: "The user cannot be create" }))
        })
        .catch(error => next(error))
})


router.get('/login', (req, res) => res.render('auth/login', { "errorMsg": req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login",
    failureFlash: true,
passReqToCallback: true,
    badRequestMessage: 'Que te peines'
}))

router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})



module.exports = router;