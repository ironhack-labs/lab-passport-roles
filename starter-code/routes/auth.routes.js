const express = require('express')
const router = express.Router()

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport");

// GO TO SIGNUP PAGE
router.get('/signup', (req, res) => {
  User.find()
    .then(users => res.render('auth/signup-form', {
      users: users
    }))
    .catch(err => console.log(`Error al encontrar el usuario ${err}`))
})
// GO TO LOGIN PAGE
router.get('/login', (req, res) => res.render('auth/login-form'))

// DELETE USER
router.post('/signup/:id/delete', (req, res) => User.findByIdAndDelete(req.params.id)
  .then(() => res.redirect('/signup'))
  .catch(err => console.log(`Error al borrar el usuario ${err}`))
)

// SIGNUP USER
router.post('/signup', (req, res) => {
  const {
    username,
    password,
    role
  } = req.body

  if (username === "" || password === "") {
    res.render("auth/signup-form", {
      message: "Rellena los campos"
    })
    return
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render("auth/signup-form", {
          message: "El usuario ya existe"
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({
          username,
          password: hashPass,
          role
        })
        .then(() => res.redirect('/'))
        .catch(() => res.render("auth/signup-form", {
          message: "Something went wrong"
        }))
    })
    .catch(error => next(error))

})

module.exports = router