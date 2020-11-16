const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const bcryptSalt = 10
const User = require('../models/user.model')

// Endpoints
router.get('/', (req, res) => res.render('index', { username: req.username }))



const isLogged = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Please, log in to access this page'})
const validRole = theRole => (req, res, next) => theRole.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Not autorized, please log in' })



router.get('/employees', isLogged, (req, res) => {
    User
        .find()
        .then(allEmployees => res.render('auth/employees', { allEmployees, isBoss: req.user.role == 'BOSS' }))  // isBoss NOT WORKING ????
        .catch(() => res.render('auth/employees', { errorMsg: 'There was a problem' }))
})


const isOwner = userId => (req, res, next) => userId === req.user.id ? next() : null

router.get('/profile/:userId', isLogged, (req, res) => {
    User
        .findById(req.params.userId)
        .then(theUser => res.render('auth/profile', { theUser, isOwner: (req.user.id === theUser.id || req.user.role == 'BOSS'), isLoggedIn: req.user.id === theUser.id })) // imageIs: theUser.profileImg.length > 1
        .catch(err => console.log(err))
})



router.get('/profile/edit/:userId', isLogged, (req, res) => {
    User
        .findById(req.params.userId)
        .then(theUser => res.render('auth/edit-profile', { theUser }))
        .catch(err => console.log('Error when going to edit:', err))
})


router.post('/profile/edit/:userId', isLogged, (req, res, next) => {

    const { username, name, description, profileImg } = req.body 

    User
        .findByIdAndUpdate(req.params.userId, { username, name, description, profileImg })
        .then(userUpdt => res.redirect('/employees'))
        .catch(err => next(err))
})




module.exports = router
