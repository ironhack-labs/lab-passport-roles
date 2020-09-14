const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Dónde crees que vas?'})

// Endpoints

//Login
router.get('/login', (req, res, next) => res.render('auth/login', { "message": req.flash("error") }))

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}))

//Create
router.get('/create', checkRole(['BOSS']), (req, res, next) => res.render('auth/create'))

router.post('/create', checkRole(['BOSS']), (req, res, next) => {
    const {username, name, password, profileImg, description, facebookId, role} = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/create', { message: "Indicate username and password" })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/create', { message: "The username already exists" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({username, password: hashPass, name, description, profileImg, facebookId, role})
                .then(() => res.redirect('/userlist'))
                .catch(error => next(error))
        })
        .catch(error => next(error))
} )

router.get('/yourprofile',checkRole(['BOSS', 'DEV', 'TA']), (req, res, next) => res.render('auth/edit', {user : req.user}))
    
router.post('/yourprofile',checkRole(['BOSS', 'DEV', 'TA']), (req, res, next) => {
    let {_id, username, name, password, profileImg, description, facebookId, role} = req.body
    //Si ha cambiado el Password hasheo el nuevo password antes de introducir las modificaciones
    
    if (password !== req.user.password) {
        let passToHash = password
        const salt = bcrypt.genSaltSync(bcryptSalt)
        password = bcrypt.hashSync(passToHash, salt)
    }

    User.findByIdAndUpdate(_id,{username, name, password, profileImg, description, facebookId,} )
        .then(elm => console.log(elm))
        .catch(error => next(error))
})

module.exports = router
