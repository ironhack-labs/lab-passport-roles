const express = require('express')
const router = express.Router()

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        }
        else {
            res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })
        }
    }
}


// Endpoints
router.get('/', (req, res) => res.render('index'))
router.get('/profile', checkLoggedIn, (req, res, next) => res.render('profile', req.user))
router.get('/view-documentation', checkRole(['Boss', 'Dev', 'TA', 'Student', 'Guest']), (req, res, next) => res.render('documentation', { user: req.user, isBoss: req.user.role === 'Boss' }))
router.get('/edit-documentation', checkRole(['Dev', 'TA']), (req, res, next) => res.send('AQUÍ ESTÁ LA EDICIÓN DE LA DOCUEMNTACIÓN'))
router.get('/remove-documentation', checkRole(['Boss']), (req, res, next) => res.send('AQUÍ ESTÁ LA SUPRESIÓN DE LA DOCUEMNTACIÓN'))

module.exports = router
