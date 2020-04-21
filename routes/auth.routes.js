const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const passport = require('passport')



router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.render('auth/signup', {
      errorMsg: 'Por favor, rellena el formulario con usuario y contraseña.',
    })
    return
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { errorMsg: 'Este usuario ya existe' })
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
            errorMsg: 'No se ha podido crear el usuario',
          })
        })
    })
    .catch((err) => next(err))
})



router.get('/login', (req, res) => res.render('auth/login'))

router.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true,
  badRequestMessage: "Por favor, rellene todos los campos."
}))

module.exports = router;
