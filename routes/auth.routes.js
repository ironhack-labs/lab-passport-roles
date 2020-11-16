const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user.model')

const bcrypt = require('bcryptjs')
const bcryptSalt = 10


// Sign Up - GET
router.get('/signup', (req, res) => res.render('auth/signup'))

// Sign Up - POST
router.post('/signup', (req, res, next) => {

  const { username, name, password, profileImg, description } = req.body

  if (username === "" || password === "") {
    res.render('auth/signup', { errorMsg: "Fill all the fields, please"}) 
    return
  }

  if (password.length < 4) {
        res.render('auth/signup', { errorMsg: "Min 5 characters" })
        return
  }

  User
    .findOne({ username })
    .then(user => {
      if (user) {
        res.render('auth/signup', { errorMsg: "This user already exists" })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User
        .create({ username, name, password: hashPass, profileImg, description })
        .then(() => res.render('profile', { successMsg: "Registered successfully" }))
        .catch(() => res.render('auth/signup', {errorMsg: "There was an error, try again"}))
    })
    .catch(error => next(error))
})

// Login - GET
router.get('/login', (req, res) => res.render('auth/login', { errorMsg: req.flash('error') }))

// Login - POST
router.post('/login', passport.authenticate('local', {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))


//Sign Out
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})


module.exports = router
