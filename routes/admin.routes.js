const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const checkRole = role => (req, res, next) => req.isAuthenticated() && req.user.role.includes(role) ? next() : res.render('auth/login', { errorMsg: 'Acceso solo para Admin' })

//list
router.get('/', checkRole('BOSS'), (req, res, next) => {
    User.find()
    .then(allUsers => res.render('admin/index', {allUsers}))
    .catch(err => console.log(`An error ocurred: ${err}`)) 
})

//delete

//add

module.exports = router