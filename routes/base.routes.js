const express = require('express')
const User = require('../models/user.model')
const router = express.Router()
const passport = require('passport')


const bcrypt = require('bcryptjs')
const bcryptSalt = 10


const isLogged = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', {errorMsg: 'Please log in to access this page'})
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'You hav not permissions. Please, contact with your admin.' })



// Endpoints:
router.get('/', (req, res) => res.render('index'))



// Private pages for all people registered in our page:
router.get('/private', isLogged, (req, res) => {
    
    User
        .find()
        .then(allUsers => res.render('auth/private', { allUsers }))
        .catch(err => console.log(err))

})


// Create new user (only TA and BOSS):
router.get('/create-new', isLogged, checkRole(['BOSS', 'TA']), (req, res) => res.render('auth/create'))

router.post('/create-new', isLogged, checkRole(['BOSS', 'TA']), (req, res, next) => {

    const { username, password, role } = req.body
    
    if (!username || !password || !role) {
        res.render('auth/create', { errorMsg: 'Please, fill in all fields.' })
        return
    }

    User 
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/create', { errorMsg: 'User already registered' })
                return
            }
            
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass, role})
                .then(() => res.redirect('/private'))
                .catch(() => res.render('auth/create', { errorMsg: 'There was an error' }))
            
    })

        .catch(err => next(err))

})

router.post('/:id/delete',  isLogged, checkRole(['BOSS']), (req, res) => {

    User
            .findByIdAndRemove(req.params.id)
            .then(res.redirect('/private'))
            .catch(err => console.log(err))
    
})


router.get('/private/:id',  isLogged, checkRole(['BOSS', 'TA']), (req, res) => {

    User
        .findById(req.params.id)
        .then(allInfo => res.render('auth/show.hbs', { allInfo }))
        .catch(err => console.log(err))

})

router.post('/:id/show',  isLogged, checkRole(['BOSS', 'TA']), (req, res) => {

    const { username, password, role } = req.body

    User
            .findByIdAndUpdate(req.params.id, { username, password, role })
            .then(res.redirect('/private'))
            .catch(err => console.log(err))           

})


router.get('/private/:id/edit',  isLogged, checkRole(['BOSS']), (req, res) => {

    User
    .findById(req.params.id)
    .then(userDet => res.render('auth/edit', { userDet }))
    .catch(err => console.log(err))

})


module.exports = router
