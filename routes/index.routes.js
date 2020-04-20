const express = require('express');
const router = express.Router();

const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next(): res.redirect('/login')

// const checkRole = role => (req, res, next) => req.isAuthenticated() && req.user.role.includes(role) ? next() : res.render('auth/login', { errorMsg: 'Acceso solo para Admin' })
// router.get('/admin', checkRole('BOSS'), (req, res) => res.render('administrador/admin'))



/* GET home page */
router.get('/', (req, res) => res.render('index'));
router.get('/profile', ensureLoggedIn, (req, res) => res.render('auth/profile', req.user))



module.exports = router;