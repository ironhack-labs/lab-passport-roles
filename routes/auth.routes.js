const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const checkRole = (roles) => (req, res, next) =>
  req.isAuthenticated() && roles.includes(req.user.role)
    ? next()
    : res.render('auth/login', {
        errorMsg: `You have to be ${roles} to access this page`,
      })

//SIGNUP FORM

router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.render('auth/signup', {
      errorMsg: 'Please provide an username and password.',
    })
    return
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { errorMsg: 'This username already exists.' })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then(() => {
          res.redirect('/')
        })
        .catch((err) => {
          res.render('auth/signup', {
            errorMsg: 'Could not create user, please try again.',
          })
        })
    })
    .catch((err) => next(err))
})

//LOGIN FORM

router.get('/login', (req, res, next) => {
  res.render('auth/login', { errorMsg: req.flash('error') })
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Please fill out all the fields',
  })
)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

//PRIVATE ROUTES

router.get('/admin', checkRole('BOSS'), (req, res) =>
  res.render('auth/admin', { user: req.user })
)

module.exports = router
