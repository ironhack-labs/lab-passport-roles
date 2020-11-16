const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")


const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
// const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })




router.get('/profile', ensureAuthenticated, (req, res) => res.render('users/profile', { user: req.user }))



router.get('/show-all', ensureAuthenticated, (req, res) => {
    

        User
            .find()
            .then(allUsers => res.render("users/show-all", { allUsers }))
            .catch(err => console.log(err))
    
})

router.get('/show-all/details/:user_id', ensureAuthenticated, (req, res) => {

    

    User
        .findById(req.params.user_id)
        .then(theUser => res.render('users/showother', theUser ))
        .catch(err => console.log(err))
})

router.get('/profile/edit', ensureAuthenticated, (req, res) => {

    const userId = req.query.user_id
    

    User
        .findById(userId)
        .then(userInfo => {
            console.log(req.query.user_id)
            res.render('users/edit', { userInfo })})
        .catch(err => console.log(err))
})

router.post('/profile/edit', ensureAuthenticated, (req, res) => {

    const userId = req.query.user_id

    const { username, name, description, profileImg } = req.body     // Los datos del formulario POST, como req.body

    User
        .findByIdAndUpdate(userId, { username, name, description, profileImg })
        .then(userInfo => res.redirect('/profile'))
        .catch(err => console.log(err))
})




module.exports = router