const express = require('express')
const router = express.Router()


// Limitar a unos roles el acceso a una vista
const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })


router.get('/boss-page', checkRole(['BOOS']), (req, res) => res.render('roles/boss-page', { user: req.user }))

module.exports = router