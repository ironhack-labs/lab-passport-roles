const express = require('express')
const passport = require('passport')
const ensureLogin = require('connect-ensure-login') // Asegurar la sesión para acceso a rutas

const authRoute = express.Router()

const User = require('../models/User.models')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

/////////SIGN UP
authRoute.get('/signup', (req, res, next) => res.render('signup'))
authRoute.post('/signup', (req, res, next) => {
  const { username, password, role } = req.body

  if (username === '' || password === '') {
    res.render('signup', { message: 'Rellena todo' })
    return
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render('signup', { message: 'El usuario ya existe' })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({
        username,
        password: hashPass
      })
      //const { username, password: hashPass } = req.body//Quería usar el deconstructing en vez de instanciar, pero no me deja redeclarar const, y sin él, me da errores.

      User.create(newUser)
        .then(() => res.redirect('/private'))
        .catch(err => console.log('Hubo un error:', err))
    })
    .catch(error => {
      next(error)
    })
})
/// LOGIN
authRoute.get('/login', (req, res, next) => {
  res.render('login', { message: req.flash('error') })
})
authRoute.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/private',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
)

authRoute.get('/private', (req, res, next) => {
  res.render('private')
})

module.exports = authRoute
