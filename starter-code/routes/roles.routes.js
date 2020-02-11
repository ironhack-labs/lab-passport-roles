  const express = require('express')
  const router = express.Router()

  const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", {
      roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí`
  })

  router.get('/boss-page', checkRole(['BOSS', 'TA']), (req, res) => res.render('roles/boss-page', {
      user: req.user
  }))
  router.get('/ta-page', checkRole(['TA']), (req, res) => res.render('roles/ta-page', {
      user: req.user
  }))

  module.exports = router