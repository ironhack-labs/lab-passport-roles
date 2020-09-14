const express = require('express')
const router = express.Router()

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Endpoints
router.get('/', (req, res) => res.render('index'))

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('index', { message: 'Desautorizado, incia sesión para continuar' })
// const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        }
        else {
            res.render('index', { message: 'Desautorizado, no tienes permisos para ver eso.' })
        }
    }
}




// router.get('/', (req, res) => res.render('index'))
router.get('/profile', checkLoggedIn, (req, res, next) => res.render('profile', { user: req.user, isBoss: req.user.role === 'BOSS' }))
router.get('/platform/users-create', checkRole(['BOSS']), (req, res, next) => res.render('platform/create-user', { user: req.user, isBoss: req.user.role === 'BOSS' }))
router.post('/platform/users-create', checkRole(['BOSS']), (req,res)=> {

    const {username, name, password, profileImg, description, facebookId, role} = req.body



    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("platform/create-user", { message: "The username already exists" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass, name, profileImg, description, facebookId, role })
                .then(() => res.redirect('/users-list'))
                .catch(error => next(error))
        })
        .catch(error => next(error))

})

router.get('/users-list', checkLoggedIn, checkRole, (req, res, next) => {
    User.find()
        .then(users => res.render('users-list', {users}))
        .catch(error => console.log("parece que ha habido un error", error))

    
})


// router.get('/edit-documentation', checkRole(['Teacher', 'Admin']), (req, res, next) => res.send('AQUÍ ESTÁ LA EDICIÓN DE LA DOCUEMNTACIÓN'))
// router.get('/remove-documentation', checkRole(['Admin']), (req, res, next) => res.send('AQUÍ ESTÁ LA SUPRESIÓN DE LA DOCUEMNTACIÓN'))



module.exports = router
