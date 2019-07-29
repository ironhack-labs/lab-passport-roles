const express = require('express');
const router = express.Router();

const checkRoles = (role) => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { msg: `Necesitas ser un ${role} para acceder aquí` })

router.get('/developer', checkRoles("DEVELOPER"), (req, res, next) => res.render('roles/developer'));
router.get('/TAs', checkRoles("TA"), (req, res, next) => res.render('roles/TAs'));
router.get('/boss', checkRoles("BOSS"), (req, res, next) => res.render('roles/boss'));

module.exports = router;