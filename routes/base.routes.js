const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User.model')

const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Dónde crees que vas?'})


// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get('/userlist', checkRole(['BOSS', 'DEV', 'TA']), (req, res, next) => {
    User.find()
        .then(allUsersFound => res.render('userlist', {users : allUsersFound, user: req.user, isBoss: req.user.role === 'BOSS'}))
        .catch(err => next(err))
})

router.post('/delete/:id',checkRole(['BOSS']), (req,res,next) => {
    User.findByIdAndRemove(req.params.id)
        .then(() => res.redirect('/userlist'))
        .catch(err => next(err))

} )


  




module.exports = router
