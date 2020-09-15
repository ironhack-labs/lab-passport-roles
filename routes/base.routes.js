const express = require('express');
const router = express.Router();


const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })
// const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.roles)) {
            next()
        }
        else {
            res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })
        }
    }
}


/* GET home page */
router.get('/', checkLoggedIn, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render('index'));
router.get('/signup', checkLoggedIn, checkRole(['BOSS']), (req, res) => res.render('auth/signup'));
router.get('/profile', checkLoggedIn, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT']), (req, res) => res.render('auth/profile'))
module.exports = router;