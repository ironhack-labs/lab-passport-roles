const express = require('express')
const router = express.Router()

// Limitar a unos roles el acceso a una vista
const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", {
  roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí`
})

router.get('/editor-page', checkRole(['BOSS', 'DEVELOPER']), (req, res) => res.render('roles/editor-page', {
  user: req.user
}))
router.get('/admin-page', checkRole(['BOSS']), (req, res) => res.render('roles/admin-page', {
  user: req.user
}))

module.exports = router