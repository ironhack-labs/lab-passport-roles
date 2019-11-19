const express = require("express");
const router = express.Router();


const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { roleErrorMessage: `Necesitas ser un ${role} para acceder aquí` })
const isRole = role => (req, res, next) => req.user && req.user.role === role
router.get('/admin-page', checkRole('Boss'), (req, res) => res.render('boss-items', { user: req.user }))

router.get('/addEmployees', checkRole('Boss'), (req, res) => res.render('conditional-rendering', {
    isBoss: isRole('Boss')
}))
