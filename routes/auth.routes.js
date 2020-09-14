const express = require('express');
const router = express.Router();

const passport = require("passport")

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10


// add routes here

router.get('/signUp', (req, res) => res.render('auth/signUp'))
router.post('/signUp', (req, res, next) => {

    const { username, password ,role} = req.body
    if (username === '' || password === '') {
        res.render('auth/signUp', { message: 'Insert your username and password' })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/signUp', { message: 'Username already exists' })
                return
            }

            const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptSalt))
            User.create({ username, password: hashPass,role })
                .then(() => res.redirect('/login'))
                .catch(error => next(error))
        })
        .catch(error => next(error))
})

router.get('/login', (req, res) => res.render('auth/login', { 'errormessage': req.flash('error') }))
router.post('/login', passport.authenticate('local', {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))


module.exports = router;
