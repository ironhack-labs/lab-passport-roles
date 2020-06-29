const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require("../models/User.model")

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Logged in checker middleware
const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

const ownProfile = (req, res) => req.params.id === req.user.id ? true : false

// Role checker middleware
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.redirect('/login')

// Alternativa para enviar a la vista en el renderizado
const isBoss = user => user.role === "BOSS"
const checkBoss = () => req.user.role.includes('BOSS')
const checkDev = () => req.user.role.includes('DEV')
const checkTa = () => req.user.role.includes('TA') 
const checkStudent = () => req.user.role.includes('STUDENT')  
const checkGuest = () => req.user.role.includes('GUEST')

// Endpoints
router.get('/', (req, res) => {
    console.log('¿Está el usuario logeado?', req.isAuthenticated())
    res.render('index')
})

router.get('/list', checkAuthenticated, (req, res) => {
    User
        .find()
        .then(allEmployees => res.render('list', {allEmployees, isBoss: isBoss(req.user)}))
        .catch(err => console.log('Error al acceder a la BD: ', err))
})

//router.get('/profile', checkAuthenticated, (req, res) => res.render('profile', { user: req.user }))

router.get('/edit/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then(employee => res.render('edit', employee))
        .catch(err => console.log('Error al acceder al perfil del empleado: ', err))
})

router.post('/:id/edit', (req, res) => {
    const {username, name, profileImg, facebookId, role} = req.body

    User
        .findByIdAndUpdate(req.params.id, {username, name, profileImg, facebookId, role}, {new: true})
        .then(() => res.redirect('/list'))
        .catch(err => console.log('Error al editar el empleado: ', err))
})

router.get('/add', checkRole(['BOSS']), (req, res) => {
    res.render('add')
})

router.post('/add', checkRole(['BOSS']), (req, res) => {
    const {username, name, password, profileImg, facebookId, role} =req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", { errorMsg: "Fill in the fields." });
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "User already exist" });
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({username, name, password: hashPass, profileImg, facebookId, role})
                .then(() => res.redirect('/list'))
                .catch(err => console.log('Error al crear el nuevo empleado: ', err))
        })
})

router.get('/delete/:id', checkRole(['BOSS']), (req, res) => {
    User
        .findByIdAndRemove(req.params.id)
        .then(() => res.redirect('/list'))
        .catch(err => console.log('Error al eliminar el empleado: ', err))
})

let isUser

router.get('/profile/:id', (req, res) => {
    const owner = ownProfile(req)
    User
        .findById(req.params.id)
        .then(employee => {
            res.render('profile',{ employee, owner: owner})
        })
        .catch(err => console.log('Error al acceder al perfil: ', err))
})

module.exports = router
