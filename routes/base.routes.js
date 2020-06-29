const express = require('express')
const router = express.Router()
const User = require("./../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Endpoints
router.get('/', (req, res) => res.render('index'))

// Logged in checker middleware
const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

// Role checker middleware
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.redirect('/login')

// Check logged in session 
router.get('/perfil', checkAuthenticated, (req, res) => res.render('private/profile', {
    user: req.user
}))

// BOSS Check logged in session & roles 
router.get('/lista', checkRole(['BOSS']), (req, res) => {
    User.find()
        .then(allUsers => res.render('private/list', {
            allUsers
        }))
        .catch(err => console.log("DDBB Error", err))
})

// BOSS USERS DETAILS
router.get('/detalle/:userId', (req, res) => {
    User.findById(req.params.userId)
        .then(theUser => res.render('private/profile', theUser))
        .catch(err => console.log('Error en la BBDD', err))
})


// BOSS CREATE USER 

router.get('/crear', (req, res) => {

    res.render("private/create-form")

})

router.post('/crear', (req, res) => {

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
        .then(() => res.redirect('lista'))
        .catch(err => console.log('Error en la BBDD', err))

})

// DELETE USERS
router.post('/:id/borrar', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(theUser => res.render('private/list', theUser))
        .catch(err => console.log("DDBB Error", err))
})


// EDIT CELEBRITIES
router.get('/editar', (req, res) => {
    User
        .findById(req.query.editarID)
        .then(theUser => res.render('private/edit-form', theUser))
        .catch(err => console.log("DDBB Error", err))
})

router.post('/editar/:userId', (req, res) => {
    const {
        username,
        role
    } = req.body
    User
        .findByIdAndUpdate(req.params.userId, {
            username,
            role
        }, {
            new: true
        })
        .then(() => res.redirect(`/detalle/${req.params.userId}`))
        .catch(err => console.log("DDBB Error", err))
})

module.exports = router