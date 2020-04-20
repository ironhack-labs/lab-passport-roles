const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)
require('body-parser');

// Session Detector
const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

// Permissions Detector
const checkRole = roles => (req, res, next) => req.isAuthenticated() && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })


/* GET home page */
router.get('/', (req, res) => res.render('index'));

// GET Private Area
router.get('/privateArea', isLoggedIn, (req, res, next) => {
    User.find()
        .then(allUsers => req.user.role === "BOSS" ? res.render('auth/privateAreaBoss', { allUsers }) : res.render('auth/privateArea', { allUsers }))
        .catch(error => next(error))
})

// GET Profile
router.get('/profile', checkRole(['BOSS']), (req, res, next) => {
    const userID = req.user.id
    User.findById(userID)
        .then(foundUser => res.render('profile', foundUser))
        .catch(error => next(error))
})

// POST Profile
router.post('/profile', checkRole(['BOSS']), (req, res, next) => {
    const userID = req.user.id
    const { username, name, description} = req.body
    User.findByIdAndUpdate(userID, { username, name, description }, { new: true })
        .then(updatedProfile => res.render('profile', updatedProfile ))
        .catch(error =>next(error))
})

// GET Edit Member
router.get('/editMember/:id', checkRole(['BOSS']), (req, res, next) => {
    User.findById(req.params.id)
        .then(foundUser => res.render('editMember', foundUser))
        .catch(error => next(error))
})

// POST Edit Member
router.post('/editMember/:id', checkRole(['BOSS']), (req, res, next) => {
    const { username, name, description } = req.body
    User.findByIdAndUpdate(req.params.id, { username, name, description }, {new: true})
        .then(updatedUser => res.render('editMember', updatedUser))
        .catch(error => next(error))
})

// POST Delete Member
router.post('/deleteMember/:id', checkRole(['BOSS']), (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
        .then(res.redirect('/privateArea'))
        .catch(error => next(error))
})

// GET Add Member
router.get('/addMember', checkRole(['BOSS']), (req, res, next) => res.render('addMember'))

// POST Add Member
router.post('/addMember', checkRole(['BOSS']), (req, res, next) => {
    const { name, username, description, role, password, profileImg } = req.body
    const hashedPassword = bcrypt.hashSync(password, salt)

    User.create({ name, username, description, role, password: hashedPassword, profileImg })
        .then(res.redirect('/privateArea'))
        .catch(error => next(error))
        
})

module.exports = router;

