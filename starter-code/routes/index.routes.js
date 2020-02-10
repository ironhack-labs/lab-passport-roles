const express = require('express');
const router  = express.Router();

// Comprobar si un usuario tiene la sesión inciada
const checkLoggedIn = (req, res, next) => req.user ? next() : res.render('index', { loginErrorMessage: 'Zona restringida a usuarios registrados' })

/* GET home page */
router.get('/', (req, res, next) => res.render('index'))
// router.get("/prfile", checkLoggedIn, (req, res) => res.render("passport/proflile", { user: req.user }));

module.exports = router;