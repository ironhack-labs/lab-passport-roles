
const express = require('express')
const router = express.Router()
const passport = require("passport")

const User = require('../models/user.model')

const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('user/login', { message: 'Desautorizado, incia sesión para continuar' })
// const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        }
        else {
            res.render('index', { message: 'Desautorizado, no tienes permisos para ver eso.' })
        }
    }
}


// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/profile', checkLoggedIn, (req, res, next) => res.render('user/profile', req.user))
router.get('/profile/:id', checkLoggedIn, (req, res) => {
    
    User.findById(req.params.id)
        .then(foundUser => res.render('user/profile', foundUser))
        .catch(err => console.log(err))

})
router.get('/editprofile', checkLoggedIn, (req, res, next) => res.render('user/editprofile', req.user))
// router.get('/editprofile', checkLoggedIn, (req, res) => {
    
//     if (req.params.id === req.user.id) {
//         console.log("mismo user")
//         // User.findById(req.params.id)
//         //     .then(foundUser => res.render('user/profile', foundUser))
//         //     .catch(err => console.log(err))
//     }
//     else
//         console.log(req.params.id)
//       //  res.render('/', { message: 'Desautorizado, no tienes permisos para editar eso.' })

// })


router.get('/userlist', checkLoggedIn, (req, res, next) => {

    User.find()
    .then((users) =>  res.render('user/userlist', {users})) 
   
})
router.get('/adduser', checkRole(['BOSS']), (req, res, next) => res.render('user/adduser'))

router.post('/adduser', checkRole(['BOSS']), (req, res, next) => {

    const { username, name, password, role } = req.body
    const hasPass = bcrypt.hashSync(password, salt)
    
    User.create({ username, name, password: hasPass, role})
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router