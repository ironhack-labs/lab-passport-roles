const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

const roles = require('../scripts/roles')

router.get('/', roles.checkEmployees('DEV', 'TA'), (req, res, next) => {
    const user = req.user
    User.find({})
        .then(users => {
            res.render('pages/employees', {user: req.user, users, user})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/edit/:id', roles.checkEmployees('DEV', 'TA'), (req, res, next) => {
    const id = req.params.id
    User.findById(id)
        .then(user => {
            res.render('pages/edit-profile', {user})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.post('/edit/:id', roles.checkEmployees('DEV', 'TA'), (req, res, next) => {
    const user = req.user
    const id = req.params.id
    const { name, password, description } = req.body
        bcrypt.genSalt(bcryptSalt)
            .then(salt => {
                bcrypt.hash(password, salt)
                    .then(hashedPwd => {
                        const editedUser = {
                            name,
                            password: hashedPwd,
                            description
                        }
                        User.findByIdAndUpdate(id, editedUser)
                            .then(result => {
                                res.redirect('/employees')
                            })
                    }) 
            })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/:id', roles.checkEmployees('DEV', 'TA'), (req, res, next) => {
    const id = req.params.id
    User.findById(id)
        .then(user => {
            console.log(user)
            res.render('pages/profile', user)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})










module.exports = router