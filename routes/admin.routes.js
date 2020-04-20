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

//add
router.get('/new', (req, res, next) => res.render('admin/add'))
router.post('/', (req, res, next) => {
    const { name, username, role, password } = req.body

    User.create({ name, username, role, password })
    .then(() => res.redirect('/admin'))
    .catch(err => console.log(`An error ocurred adding the user: ${err}`))
})

//delete
router.post('/:id/delete', (req, res, next) => {
    const userId = req.params.id
    User.findByIdAndRemove(userId)
    .then(()  => res.redirect('/admin'))
    .catch(err => console.log(`An error ocurred deleting the user: ${err}`))
})


module.exports = router