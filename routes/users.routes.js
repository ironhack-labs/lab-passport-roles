const express = require('express');
const router = express.Router();
const User = require("../models/User.model")

router.get('/users', (req, res, next) => {
    User.find()
        .then(allUsers => res.render('users', { allUsers }))
        .catch(error => next(error))
})


router.get('/users/details/:id', (req, res, next) => {

    User.findById(req.params.id)
        .then(profileUsers => res.render('profile', profileUsers))
        .catch(error => next(error))
})


router.get('/users/add', (req, res, next) => res.render('add'))
router.post('/users/add', (req, res, next) => {
    const { name, surname, role, description, facebookId } = req.body

    User.create({ name, surname, role, description, facebookId })
        .then((res.redirect('/users')))
        .catch(error => next(error))

})


router.post('/users/delete', (req, res, next) => {
    User.findByIdAndRemove(req.query.id)
        .then(theuserDelate => res.redirect('/users'))
        .catch(error => next(error))
})


router.get('/users/:id/edit', (req, res, next) => {
    User.findById(req.params.id)
        .then(userEdit => res.render('edit', userEdit))
        .catch(error => next(error))
})
router.post('/users/:id/edit', (req, res, next) => {

    const { name, surname, role, description, facebookId } = req.body

    User.findByIdAndUpdate(req.params.id, { name, surname, role, description, facebookId }, { new: true })
        .then(updateUser => {
            console.log(updateUser)
            res.redirect(`/users/details/${updateUser._id}`)
        })
        .catch(error => next(error))
})





module.exports = router;