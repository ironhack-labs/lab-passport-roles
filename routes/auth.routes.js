const express = require('express');
const router = express.Router();

// Add routes here
const passport = require('passport')

const User = require('../models/user.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

//1.SignUp
router.get('/signup', (req, res) => res.render('auth/signup'))


router.post('/signup', (res, req, next) => {

    const { username, password } = req.body

    if (username === 0 || password === 0) {
        res.render("auth/signup", { msg: 'Fill all the fields' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { msg: 'User already exists' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render('auth/signup', { msg: 'An error has occurred' }))
        })
        .catch(err => next(err))
})



//2.LogIn
router.get('/login', (req, res, next) => { res.render('auth/login') })

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}))


//3.LogOut
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

module.exports = router;
