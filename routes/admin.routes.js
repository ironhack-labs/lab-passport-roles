const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const checkRole = roleData => (req, res, next) => req.isAuthenticated() && req.user.role.includes(roleData) ? next() : res.render('auth/login',  { errorMsg: 'Área restringida' }) 

//Users
router.get('/', checkRole('BOSS'), (req, res) => {
    User.find()
        .then(users => res.render('admin/index', { users }))
})
//Delete
router.post('/:id/delete', (req, res, next) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/admin'))
        .catch((err) => console.log('No se ha borrado', err))
})

//Add
router.get('/new', (req, res, next) => { res.render('admin/add-user')})
router.post('/', (req, res, next) => {
    const { username, name, role, password } = req.body
    User.create({ username, name, role, password })
        .then(data => res.redirect('/admin'))
        .catch(err => console.log('El usuario no se creo', err))
})


module.exports = router;