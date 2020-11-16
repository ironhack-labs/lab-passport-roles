const express = require('express')
const router = express.Router()

const User = require('../models/user.model')

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'You need to log in to continue' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        }
        else {
            res.render('auth/login', { message: 'error' })
        }
    }
}

// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/profile', checkLoggedIn, (req, res, next) => res.render('profile', req.user))

// List employees
router.get('/employees', checkRole(['BOSS']), (req, res, next) => {

    User.find({})
        .then(employees => res.render('employees', { employees }))
        .catch(err => next(err))

})

// Add user
router.get('/add-user', checkRole(['BOSS']), (req, res, next) => res.render('auth/user-create-form', req.user))

// Delete employee
router.get('/delete/:id', (req, res, next) => {

    const id = req.params.id

    User.findByIdAndDelete(id)
        .then(() => res.redirect('/employees'))
        .catch(err => next(err))

})


module.exports = router