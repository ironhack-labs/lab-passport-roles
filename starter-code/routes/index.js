const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect(`/${req.user.role}`.toLowerCase())
  }
  return next()
}

router.get('/', isAuth, (req, res, next) => {
  res.render('index')
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  req.app.locals.loggedUser = req.user
  return res.redirect(`/${req.user.role}`.toLowerCase())
})

router.get('/logout', (req, res, next) => {
  req.logOut()
  return res.redirect('/')
})

router.get('/boss', (req, res, next) => {
  res.redirect('/gm')
})

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
      res.redirect('/alumni')
    }
)

router.get('/alumni', (req, res, next) => {
  User.find({ role: 'ALUMNI' })
      .then(alumni => {
        res.render('alumni', {alumni})
      })
      .catch(err => {
        req.app.locals.error = err
      })
})

module.exports = router