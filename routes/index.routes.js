const express = require('express')  
const router = express.Router()  
const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

/* GET home page */
router.get('/', (req, res) => res.render('index'))  
router.get('/boss', ensureLoggedIn, (req, res) => res.render('auth-views/boss', req.user))

const isBoss = user => user.role === 'BOSS'
const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('index', { loginErrorMessage: 'Acceso restringido' })

router.get('/boss', isBoss, (req, res) => res.render("boss", { user: req.user }))

module.exports = router  



