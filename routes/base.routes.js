const express = require('express')
const router = express.Router()

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Not authorized, please log in' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Not authorized, you do not have permission' })

const User = require("../models/user.model")

// Endpoints
//router.get('/', (req, res) => res.render('index'))

// Listing all users
router.get('/', (req, res) => {

    User
        .find({})
        .then(allUsers => res.render('index', { allUsers }))
        .catch(err => console.log(err))

})


// Show user details
router.get('/show/:user_id', (req, res) => {

    const userId = req.params.user_id

    User
        .findById(userId)
        .then(theUser => res.render('auth/show', theUser))
        .catch(err => console.log(err))

})



router.get('/boss', ensureAuthenticated, checkRole(['BOSS']), (req, res) => res.render('auth/boss', { user: req.user, isBoss: req.user.role.includes('BOSS') }))







module.exports = router
