const express = require('express')
const router = express.Router()


const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Inicia sesión para continuar' })

const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })
/*
const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            console.log("llegue hasta aqui")
            next()
        }
        else {
            res.render('auth/login', { message: 'No tienes permiso para ingresar!.' })
        }
    }
}
*/





// Endpoints
router.get('/', (req, res) => res.render('index'))
//router.get('/admin-index', checkRole(['BOSS']), (req, res, next) => res.render('auth/admin-index', { user: req.user, isAdmin: req.user.role === 'BOSS' }))
router.get('/admin-index', checkLoggedIn, (req, res, next) => res.render('auth/admin-index', req.user))
//router.get('/create', checkLoggedIn, (req, res, next) => res.render('auth/create', req.user))
//router.get('/create', checkRole(['BOSS']), (req, res, next) => res.render('auth/create', { user: req.user, isAdmin: req.user.role === 'BOSS' }))
//router.get('/admin-index', checkRole(['BOSS','DEV', 'TA', 'STUDENT', 'GUEST']), (req, res, next) => res.render('auth/admin-index', { user: req.user }))
router.get('/create', checkRole(['BOSS']), (req, res, next) => res.render('create', { user: req.user }))
//router.get('/list-users', checkRole(['BOSS']), (req, res, next) => res.render('auth/list-users', { user: req.user }))

router.get('/ta-access', checkRole(['TA']), (req, res, next) => res.render('ta-access', { user: req.user }))
router.get('/create-courses', checkRole(['TA']), (req, res, next) => res.render('create-courses', { user: req.user }))
router.get('/list-courses', checkRole(['TA']), (req, res, next) => res.render('list-courses', { user: req.user }))



module.exports = router
