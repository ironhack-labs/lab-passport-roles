const express = require('express');
const router = express.Router();

const checkRoles = (role) => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { msg: `Necesitas ser un ${role} para acceder aquí` })


router.get('/boss', checkRoles("BOSS"), (req, res, next) => res.render('roles/boss'));



router.get('/developer', checkRoles("DEVELOPER"), (req, res, next) => res.render('roles/developer'));
router.get('/ta', checkRoles("TA"), (req, res, next) => res.render('roles/ta'));




module.exports = router;