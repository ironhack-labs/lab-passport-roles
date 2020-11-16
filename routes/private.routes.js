const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const bcryptSalt = 10
const User = require('../models/user.model')



// MIDDLEWARES

const isLogged = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Please, log in to access this page'})
const validRole = theRole => (req, res, next) => theRole.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Not autorized, please log in' })


// CREATE USER

router.get('/create-user', isLogged, validRole('BOSS'), (req, res) => res.render('auth/create-user'))

router.post('/create-user', isLogged, validRole('BOSS'), (req, res, next) => {
    const { username, password, name, role } = req.body
    
    if (!username || !password || !name) {
        res.render('auth/create-user', { errorMsg: 'Please, fill in all fields' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/create-user', { errorMsg: 'Username already registered' })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
            User
                .create({ username, password: hashPass, name, role })
                .then(() => res.redirect('/employees'))
                .catch(() => res.render('/create-user', { errorMsg: 'There was an error' }))
        })
        .catch(err => next(err))
})




// DELETE USERS

router.post('/:userId/delete', isLogged, validRole('BOSS'), (req, res) => {
    User
        .findByIdAndDelete(req.params.userId)
        .then(() => res.redirect('/employees'))
        .catch(err => console.log('Error deleting:', err))
})





module.exports = router
