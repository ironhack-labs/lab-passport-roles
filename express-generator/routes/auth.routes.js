const express = require("express")
const router = express.Router()
const passport = require("passport")
const bcrypt = require("bcryptjs")

const User = require("../models/User.model")

const bcryptSalt = 10

router.get('/signup', (req, res, next) => res.render("auth/signup"))
router.post('/signup', (req, res, next) => {
    
    const { username, password } = req.body

    if (username === 0 || password.length === 0){
        res.render("auth/signup", { message: "Indicate username and password"})
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { message : "The username already exists" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)  // Encripta la password 
            const hasPass = bcrypt.hashSync(password, salt)

            User.create({ username, password:hasPass })
                .then(() => res.redirect('/'))
                .catch(err => next(err))
        })
        .catch(err => console.log(err))
})


router.get("/login", (req, res, next) => res.render("auth/login", { "message": req.flash("error") }))

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true

}))

module.exports = router