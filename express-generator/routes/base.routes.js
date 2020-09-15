const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require('../models/User.model')
const { all } = require('./auth.routes')
const bcryptSalt = 10

const checkLogged = (req, res, next) => req.isAuthenticated() ? next() : res.render("auth/login", {message: "Log to see more"})

const checkRole = rolesCheck => {
    return (req, res, next) => {
        req.isAuthenticated() && rolesCheck.includes(req.user.role) ? next() : res.render("auth/login", {message: "you don't have enough permits to see that"})
    }
}

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/all-users', (req, res, next) => {
    User.find()
        .then( allUsers => res.render('company/all-users', {allUsers}))
        .catch(err => next(err))
})

// With role BOSS you can acces to /users
router.get('/users', checkRole(["BOSS"]), (req, res, next) => {
    User.find({ "role": { $ne: "BOSS" } })
        .then(allUsers => res.render("/company/users", { allUsers }))
        .catch(err=> next(err))
   
})

module.exports = router
