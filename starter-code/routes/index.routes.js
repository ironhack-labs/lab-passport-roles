  const express = require('express')
  const router = express.Router()

  const isAdmin = user => user && user.role === 'admin'
  const isTA = user => user && user.role === 'developer'

  const checkLoggedIn = (req, res, next) => req.user ? next() : res.render('index', {
    loginErrorMessage: 'Zona restringida a usuarios registrados'
  })

  router.get('/signup', (req, res) => res.render('passport/signup-form', {
    isAdmin: isAdmin(req.user)
  }))

  router.get('/', (req, res) => res.render('index', {
      isAdmin: isTA(req.user)
    }))
  router.get("/profile", checkLoggedIn, (req, res) => res.render("profile", {
    user: req.user
  }));

  module.exports = router