console.log('10. En celebrities.routes.js')

const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const saltRounds = 10;

const User = require('../models/User.model')

// Middlewares

const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Unauthorized, log in please' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {

        if (rolesToCheck.includes(req.user.role)) {

            next()

        }
        else {
            res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })
        }
    }
}

const hasPrivilege = target_id => (req, res, next) => {

    if (req.user.role === 'boss' || req.user.id === target_id) {

        next()

    }
    else {

        res.render('auth/login', { message: 'Acceso denegado.' })

    }

}

// Endpoints

// List of all items
router.get('/', isLoggedIn, (req, res, next) => {

    res.render('employees/index')

})

router.get('/profile', (req, res, next) => res.redirect(`/employees/profile/${req.user.id}`))

router.get('/profile/:id', isLoggedIn, (req, res, next) => {

    User.findById(req.params.id)
        .then(matchedUser => {

            res.render('employees/profile', { user: matchedUser, isBoss: req.user.role === 'boss', isOwner: req.user.id === req.params.id })

        })


})

router.get('/superuser', isLoggedIn, checkRole(['boss']), (req, res, next) => {

    User.find()
        .then((allUsers => res.render('employees/superuser', { allUsers })))
        .catch(error => next(error))

})

// Shows the view for creating a new item
router.get('/create', isLoggedIn, checkRole(['boss']), (req, res) => {

    res.render('employees/create')

})

// Creates new item into the DB (CREATE)
router.post('/create', isLoggedIn, checkRole(['boss']), (req, res, next) => {

    const { name, username, password, role } = req.body

    User.find({ username })
        .then(matchedUser => {

            if (matchedUser.length) {

                console.log(matchedUser)

                res.render('employees/create', { errorMessage: 'Este nombre de usuario ya está en uso' })

                return

            }

            const salt = bcrypt.genSaltSync(saltRounds)

            const encryptedPassword = bcrypt.hashSync(password, salt)

            return User.create({ username, name, password: encryptedPassword, role })
                .then(() => res.redirect('/employees/superuser'))
                .catch(error => next(error))

        }).catch(error => next(error))



})

// Deletes an item from the database (DELETE)
router.post('/delete', isLoggedIn, checkRole(['boss']), (req, res, next) => {

    User.findByIdAndRemove(req.body.id)
        .then(User.find())
        .then(res.redirect('/employees/superuser'))
        .catch(error => next(error))

})

// Shows the view for editing
router.get('/edit/:id', isLoggedIn, (req, res) => {

    User.findById(req.params.id)
        .then(matchedUser => {

            res.render('employees/edit', { matchedUser, isBoss: req.user.role === 'boss' })

        })
        .catch(error => next())

})

// Updates the item data and shows it's detailed view (UPDATE)
router.post('/edit/:id', isLoggedIn, (req, res, next) => {

    const { profileImg, name, username, password, role } = req.body

    const salt = bcrypt.genSaltSync(saltRounds)
    const encryptedPassword = bcrypt.hashSync(password, salt)

    const user_id = req.params.id

    User.findByIdAndUpdate(user_id, { username, name, password: encryptedPassword, profileImg, role })
        .then(() => res.redirect(`/employees/profile/${user_id}`))
        .catch(error => next(error))

})

router.get('/wall', isLoggedIn, (req, res, next) => {

    User.find()
        .then(allUsers => res.render('employees/wall', { allUsers, isBoss: req.user.role === 'boss' }))
        .catch(error => next(error))

})


module.exports = router
