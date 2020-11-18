const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

// add routes here



router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})
router.post('/signup', (req, res, next) => {
    const { username, name, password, role } = req.body
    bcrypt.genSalt(bcryptSalt)
        .then(salt => {
            bcrypt.hash(password, salt)
                .then(hashedPwd => {
                    const newUser = {
                        username,
                        name,
                        password: hashedPwd,
                        role
                    }
                    User.create(newUser)
                        .then(createdUser => {
                            res.redirect('/')
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })

})

router.get('/login', (req, res, next) => {
    res.render('auth/login', {"message": req.flash('error')})
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}))



router.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/')
})




module.exports = router;
