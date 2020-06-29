const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10


const isBoss = user => user.role === 'BOSS'
const checkRole = roles => (req, res, next) => {
    return req.isAuthenticated() && roles.includes(req.user.role) ?
        next() : res.render('auth/login', { errorMsg: 'Área restringida' })
}
const canEdit = roles => (req, res, next) => {
    console.log('PARAMS', req.params)
    if (checkRole(roles) && (isBoss(req.user) || req.user._id == req.params.id)) {
        next()
    }
}

router.get('/users', checkRole(['BOSS', 'TA', 'DEV', 'STUDENT', 'GUEST']), (req, res, next) => {
    console.log('DATA', req.user)
    User.find()
        .then(allUsers => res.render('users', {
            allUsers, isBoss: isBoss(req.user),
            id: req.user.id
        }))
        .catch(error => next(error))
})

router.get('/users/details/:id', (req, res, next) => {

    User.findById(req.params.id)
        .then(profileUsers => res.render('profile', profileUsers))
        .catch(error => next(error))
})


router.get('/users/add', checkRole('BOSS'), (req, res, next) => res.render('add'))
router.post('/users/add', (req, res, next) => {
    const { username, name, password, description, facebookId, role } = req.body
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    User.create({ username, name, password: hashPass, description, facebookId, role })
        .then((res.redirect('/users')))
        .catch(error => next(error))

})

router.post('/users/delete', (req, res, next) => {
    User.findByIdAndRemove(req.query.id)
        .then(theuserDelate => res.redirect('/users'))
        .catch(error => next(error))
})


router.get('/users/:id/edit', canEdit(['BOSS', 'TA', 'DEV', 'STUDENT', 'GUEST']), (req, res, next) => {
    User.findById(req.params.id)
        .then(userEdit => res.render('edit', userEdit))
        .catch(error => next(error))
})
router.post('/users/:id/edit', (req, res, next) => {

    const { name, surname, password, description, facebookId, role } = req.body

    User.findByIdAndUpdate(req.params.id, { name, surname, password, description, facebookId, role }, { new: true })
        .then(updateUser => {
            console.log(updateUser)
            res.redirect(`/users/details/${updateUser._id}`)
        })
        .catch(error => next(error))
})





module.exports = router;

