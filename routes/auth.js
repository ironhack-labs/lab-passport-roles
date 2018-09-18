const router   = require('express').Router()
const User     = require('../models/User')
const passport = require('passport')


router.get('/', (req, res) => {
  res.redirect('/signup')
})

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  User.register(req.body, req.body.password)
  .then(user => res.redirect('/login'))
  .catch(error => next(error))
})

router.get('/login', (req, res) => {
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local'), (req,res,next) => {
  res.redirect('/employees')
})

module.exports = router