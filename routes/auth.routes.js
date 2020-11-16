const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const bcryptSalt = 10
const User = require('../models/user.model')




// SIGN UP

router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', (req, res, next) => {
    const { username, password, name } = req.body
    
    if (!username || !password || !name) {
        res.render('auth/signup', { errorMsg: 'Please, fill in all fields' })
        return
    }
    User
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/signup', { errorMsg: 'Userbame already registered' })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
            
            User
                .create({ username, password: hashPass, name })
                .then(() => res.redirect('/'))
                .catch(() => res.render('/signup', {errorMsg: 'There was an error'}))
        })
        .catch(err => next(err))
})





// LOG IN

router.get('/login', (req, res) => res.render('auth/login', {errorMsg: req.flash('error')}))


router.post('/login', passport.authenticate('local', {
		successRedirect: '/employees',
		failureRedirect: '/login',
		failureFlash: true,
		passReqToCallback: true
}))





// LOG OUT

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


module.exports = router
