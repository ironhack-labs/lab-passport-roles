const express = require('express')
const router = express.Router()

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport");

// GO TO LOGIN PAGE
router.get('/login', (req, res) => res.render('auth/login-form', {
  message: req.flash("error")
}))

// LOG OUT
router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/')
})

// LOGIN USER
router.post('/login', passport.authenticate("local", {
  successRedirect: "/user/panel",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

// LOGIN FACEBOOK
router.post('/facebookLogin', passport.authenticate("facebook"))

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/'
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/user/panel');
  });

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
        .then(() => res.redirect('/user/panel'))
        .catch(() => res.render("auth/signup-form", {
          message: "Something went wrong"
        }))
    })
    .catch(error => next(error))

})

module.exports = router