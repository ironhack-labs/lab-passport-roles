const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => res.render('index'));


const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')


const checkRole = role => (req, res, next) => req.isAuthenticated() && req.user.role.includes(role) ? next() : res.render('auth/login', { errorMsg: 'Área restringida' })


router.get('/', (req, res, next) => res.render('index'))
router.get('/profile', ensureLoggedIn, (req, res) => res.render('profile', req.user))


module.exports = router
