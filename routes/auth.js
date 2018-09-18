const router   = require('express').Router()
const User     = require('../models/User')
const passport = require('passport')

router.get('/signup', (req, res) => {
 res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
 User.register(req.body, req.body.password)
 .then(user => res.redirect('/ironhack/users'))
 .catch(error => next(error))
})

router.get('/login', (req, res) => {
 res.render('auth/login')
})

router.post('/login', passport.authenticate('local'),(req, res, next)=>{
 console.log(req.user)
 res.redirect('/ironhack')
})


module.exports = router