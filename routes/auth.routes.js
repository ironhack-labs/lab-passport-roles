const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const checkLoggedIn = (req, res, next) =>
  req.isAuthenticated()
    ? next()
    : res.render('index', { loginErrorMessage: 'Restricted access' })

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
    successRedirect: '/dashboard',
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

router.get('/dashboard', checkLoggedIn, (req, res) =>
  res.render('auth/dashboard', { user: req.user })
)

router.get('/user-db', checkLoggedIn, (req, res) =>
  User.find()
    .then((users) => res.render('auth/user-db', { users }))
    .catch((err) => next(err))
)

router.get('/user/details/:userId', checkLoggedIn, (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.render('auth/profile-details', user)
    })
    .catch((err) => {
      console.log(
        'An error ocurred when fetching an specific user by ID: ',
        err
      )
      next(err)
    })
})

//edit users

router.get('/user/edit/:userId', (req, res, next) => {
  if (req.user._id != req.params.userId && req.user.role !== 'BOSS') {
    res.render('index', { loginErrorMessage: 'Restricted access' })
  }

  User.findById(req.params.userId)
    .then((fetchedUser) => {
      res.render('auth/edit-profile', fetchedUser)
    })
    .catch((err) => {
      console.log(
        'An error ocurred when fetching a user entry to be edited: ',
        err
      )
      next(err)
    })
})

router.post('/user/edit/:userId', (req, res, next) => {
  const { name, profileImg, description, role } = req.body

  req.user.role == 'BOSS'
    ? User.findByIdAndUpdate(
        req.params.userId,
        { name, profileImg, description, role },
        { new: true }
      )
        .then((updatedUser) => {
          res.redirect(`/user/details/${updatedUser.id}`)
        })
        .catch((err) => {
          next(err)
        })
    : User.findByIdAndUpdate(
        req.params.userId,
        { name, profileImg, description },
        { new: true }
      )
        .then((updatedUser) => {
          res.redirect(`/user/details/${updatedUser.id}`)
        })
        .catch((err) => {
          next(err)
        })
})

module.exports = router
