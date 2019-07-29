const express = require('express');
const router = express.Router();

const checkRoles = (role) => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { msg: `Necesitas ser un ${role} para acceder aquí` })

router.get('/boss', checkRoles("Boss"), (req, res, next) => res.render('boss'));
router.get('/ta', checkRoles("TA"), (req, res, next) => res.render('ta'));

module.exports = router