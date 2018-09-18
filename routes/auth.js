const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

function checkRole(role, role2, role3) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role || req.user.role === role2 || req.user.role === role3) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}

router.get('/addUser', checkRole('BOSS'), (req, res, next) => {
  res.render('auth/addUser')
})

router.post('/addUser', (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => res.redirect('/login'))
    .catch(error => next(error))
})

// login
router.get('/login', (req, res, next) => {
  res.render('auth/login')
})
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.redirect('/addUser')
})

module.exports = router