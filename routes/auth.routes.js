const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const checkLoggedIn = (req, res, next) =>
  req.isAuthenticated() ? next() : res.redirect('/login')

//SIGNUP FORM

router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  console.log("before checking fields")
  if (!username || !password) {
    res.render('auth/signup', {
      errorMsg: 'Please provide an username and password.',
    })
    return
  }
  console.log("before looking for user")
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { errorMsg: 'This username already exists.' })
        return
      }
      console.log("before salting")
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      console.log("after salting")
      User.create({ username, password: hashPass })
        .then(() => {
          console.log("after creation, before redirection")
          res.redirect('/')
        })
        .catch((err) => {
          res.render('auth/signup', {
            errorMsg: 'Could not create user, please try again.',
          })
          console.log(err)
        })
    })
    .catch((err) => {next(err), console.log(err)})
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

router.get('/admin', checkLoggedIn, (req, res) =>
  res.render('auth/admin', { user: req.user })
)

module.exports = router
