const express = require('express')
const router = express.Router()

// Limitar a unos roles el acceso a una vista
const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })

router.get('/developer-page', checkRole(['DEVELOPER', 'BOSS']), (req, res) => res.render('roles/developer-page', { user: req.user }))
router.get('/boss-page', checkRole(['BOSS']), (req, res) => res.render('roles/boss-page', { user: req.user }))

module.exports = router