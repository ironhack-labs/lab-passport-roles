const express = require('express')
const router = express.Router()

const User = require('./../models/User.model')

//Recuperar index
router.get('/profile', (req, res) => {
    console.log("Endpoint index OK")
    // User
    //     .find()
    //     .then(allUsers => {
    //         res.render('auth/profile', { allUsers })
    //         console.log(allUsers)
    //     })
    //     .catch(err => console.log("Error en devolviendo bbdd", err))
})

//CREATE NEW
router.get('/new', (req, res) => {

    res.render('new')
})

router.post('/new', (req, res) => {
    const { name, username, password, profileImg, description, facebookId, role } = req.body


    User.create({ name, username, password, profileImg, description, facebookId, role })
        .then(newEntry => {
            console.log("New entry created", newEntry)
            res.redirect("/")
        })
        .catch(err => console.log("Error creating new entry", err))

})


router.get('/:id/edit', (req, res, next) => {

    User.findById(req.params.id)
        .then(profileUsers => res.render('auth/edit', profileUsers))
        .catch(error => next(error))
})

router.post('/:id/edit', (req, res, next) => {

    const { name, surname, password, description, facebookId, role } = req.body

    User.findByIdAndUpdate(req.params.id, { name, surname, password, description, facebookId, role }, { new: true })
        .then(updateUser => {
            console.log(updateUser)
            res.redirect('/profile')
        })
        .catch(error => next(error))
})

router.get('/:id/delete', (req, res, next) => {
    console.log("BORRATE PORDIO")
    User.findByIdAndRemove(req.params.id)
        .then(deletedUser => {
            console.log('deletedUser')
            res.redirect('/profile')
        })
        .catch(error => next(error))
})


module.exports = router