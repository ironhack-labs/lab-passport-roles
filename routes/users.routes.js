const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

const roles = require('../scripts/roles')

// router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
//     User.find({})
//         .then(users => {
//             res.render('auth/users', { user: req.user, users })
//         })
//         .catch(err => {
//             console.error(err)
//             res.send(err)
//         })
// })
router.get('/', roles.checkBoss('BOSS'), (req, res, next) => {
    User.find({})
        .then(users => {
            res.render('pages/users', { user: req.user, users })
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.post('/', roles.checkBoss('BOSS'), (req, res, next) => {
    const { username, name, role } = req.body
    const pwd = '1234'
    bcrypt.genSalt(bcryptSalt)
    .then(salt => {
        bcrypt.hash(pwd, salt)
        .then(hashedPwd => {
            const newUser = {
                username,
                name,
                password: hashedPwd,
                role
            }
            User.create(newUser)
                .then(user => {
                    console.log(user)
                    res.redirect('/users')
                })
            })
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })

})

router.get('/delete/:id', roles.checkBoss('BOSS'), (req, res, next) => {
    const id = req.params.id
    console.log(id)
    User.findById(id)
        .then(user => {
            if(user.role === 'BOSS'){
                res.redirect('/')
            }else {
                User.findOneAndRemove({ _id: user._id })
                    .then(response => {
                        console.log(response)
                        res.redirect('/users')
                    })
            }
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/:id', roles.checkBoss('BOSS'), (req, res, next) => {
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