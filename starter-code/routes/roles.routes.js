const express = require('express');
const router = express.Router();

const checkRoles = (role) => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { msg: `Necesitas ser un ${role} para acceder aquí` })
router.get('/developer', checkRoles("Developer"), (req, res, next) => res.render('roles/Developer'));
router.get('/TA', checkRoles("TA"), (req, res, next) => res.render('roles/TA'));
router.get('/Boos', checkRoles("Boos"), (req, res, next) => res.render('roles/Boos'));

module.exports = router;



