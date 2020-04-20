const express = require('express')
const router = express.Router()



const User = require('../models/User.model.js')

const passport = require('passport')

const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')
const checkRole = role => (req, res, next) => req.isAuthenticated() && req.user.role.includes(role) ? next() : res.render('auth/login', { errorMsg: 'Restricted Zone' })


/* GET home page */
router.get('/', (req, res) => res.render('index', { user: req.user }))

//Profile
router.get('/profile', (req, res) => res.render('privates/profile', { user: req.user, canUpdate: true }))

//UPDATE
router.get('/update/:id', ensureLoggedIn, (req, res) => {
    User.findById(req.params.id)
        .then(foundUser => res.render('privates/update', { user: foundUser }))
        .catch(error => next(error))
})

router.post('/update/:id', ensureLoggedIn, (req, res) => {

    const { profileImg, name, description } = req.body

    User.findByIdAndUpdate(req.params.id, { profileImg, name, description })
        .then(res.redirect('/profile'))
        .catch(error => next(error))
})

//READ
router.get('/list-users', ensureLoggedIn, (req, res) => {
    User.find()
        .then(foundUsers => res.render('privates/users-list', { users: foundUsers }))
        .catch(error => next(error))
})

router.get('/profile/:id', (req, res) => {
    User.findById(req.params.id)
        .then(foundUser => res.render('privates/profile', { user: foundUser, canUpdate: false }))
        .catch(error => next(error))
})

//Delete
router.get('/list-users/:id/delete', checkRole('BOSS'), (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
        .then(res.redirect('/list-users'))
        .catch(error => next(error))
})

//BOSS UPDATE
router.get('/update/:id/boss', checkRole('BOSS'), (req, res) => {
    User.findById(req.params.id)
        .then(foundUser => res.render('privates/update-boss', { user: foundUser }))
        .catch(error => next(error))
})

router.post('/update/:id/boss', checkRole('BOSS'), (req, res) => {

    const { profileImg, name, description, role } = req.body

    User.findByIdAndUpdate(req.params.id, { profileImg, name, description, role }, { new: true })
        .then(updatedUser => res.redirect(`/profile/${updatedUser._id}`))
        .catch(error => next(error))
})

module.exports = router
