const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const passport = require('passport')

// add routes here

//SIGNUP FORM

router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', (req, res, next) => {
  const { name, password } = req.body

  if (!name || !password) {
    res.render('auth/signup', {
      errorMsg: 'Please provide an username and password.',
    })
    return
  }

  User.findOne({ name })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { errorMsg: 'This username already exists.' })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ name, password: hashPass })
        .then(() => {
          res.redirect('/')
        })
        .catch(() => {
          res.render('auth/signup', {
            errorMsg: 'Could not create user, please try again.',
          })
        })
    })
    .catch((err) => next(err))
})

module.exports = router
