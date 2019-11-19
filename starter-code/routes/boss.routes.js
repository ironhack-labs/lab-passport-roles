const express = require('express');
const router = express.Router();
const User = require('../models/user.models')
const bcrypt = require('bcrypt')
const bcryptSalt = 10;


router.get('/', (req, res, next) => res.render('boss/index'))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})

router.get('/list', (req, res) => {
    User.find()
        .then(employees => res.render('boss/list', {
            employees
        }))
        .catch(err => console.log("Error consultando la BBDD: ", err))
})

router.get('/details/:id', (req, res) => {
    User.findById(req.params.id)
        .then(employee => res.render('boss/details', {
            employee
        }))
        .catch(err => console.log("Error consultando la BBDD", err))
})

router.get('/new', (req, res) => res.render('boss/new'))

router.post('/new', (req, res) => {
    const {
        username,
        password,
        role
    } = req.body
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    User.create({
            username,
            password: hashPass,
            role
        })
        .then(newEmployee => res.redirect('/boss'))
        .catch(err => console.log("Error consultando la BBDD", err))
})

router.get('/:id/delete', (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then(() => res.redirect('/boss'))
        .catch(err => console.log("Error consultando la BBDD", err))
})

module.exports = router;