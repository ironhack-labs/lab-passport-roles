const express = require('express');
const router = express.Router();
const passport = require("passport")
const User = require("../models/user.model")
const bcrypt = require("bcrypt");
const { find } = require('../models/user.model');
const bcryptSalt = 10

// Endpoints
router.get('/', (req, res) => res.render('index'))
const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' }, console.log('oletú'))
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' }, console.log('oleyo'))

router.get('/new-user', ensureAuthenticated, checkRole('BOSS'), (req, res) => {
    User
        .find()
        .then(resultado => {
            res.render('new-user', { user: req.user, isBoss: req.user.role.includes('BOSS'), resultado })
        })

})
////////
router.get('/users', ensureAuthenticated, checkRole(['DEV', 'TA', 'BOSS']), (req, res) => {
    console.log('estoy en users')
    User
        .find()
        .then(resultado => {
            res.render('users', { resultado } )
        })

})
///////////

router.post('/new-user', (req, res) => {
    const { username, password, role } = req.body
    
        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)
    User
        .create({
        username,
        password: hashPass,
        role,
        })
    .then(res.redirect('new-user'))
    
})


router.get('/edit-user/:userid', ensureAuthenticated, checkRole('BOSS'), (req, res) => {
    const userid= req.params.userid
    User
        .findById(userid)
        .then(resultado => {
            res.render('edit-user', resultado )
        })

})

router.post('/edit-user/:userid', (req, res) => {
    const { username, role } = req.body
    const userid = req.params.userid
    console.log(userid)
    User
        .findByIdAndUpdate(userid, {
            username: username,
            role: role
        })
        .then((result) => {
            res.redirect('/new-user')
        })
        .catch((err) => console.log(err.message))
})


router.get('/delete-user/:userid', (req, res) => {
    const userid = req.params.userid
    User
        .findByIdAndDelete(userid)
        .then((result) => {
            console.log(result)
            res.redirect('/new-user')
        })
        .catch((err) => console.log(err.message))
})



module.exports = router
