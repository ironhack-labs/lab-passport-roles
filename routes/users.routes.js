const express = require('express')
const router = express.Router()
const User = require('./../models/User.model')
const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Please log in first.' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'User without permissions' })


// Profiles
router.get('/my-profile', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => res.render('profile', { user: req.user, isAdmin: req.user.role.includes('BOSS'), isEmployee: () => req.user.role.includes('DEV') || req.user.role.includes('TA') }))


router.get('/users-list', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA']), (req, res, next) => {
    User
        .find()
        .then(allUsers => res.render('users-list', { allUsers, isAdmin: req.user.role.includes('BOSS') }))
        .catch(err => next(err))
})


router.get('/profile/:id', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res, next) => {
    const userId = req.params.id
    User
        .findById(userId)
        .then(user => res.render('profile', { user, isAdmin: req.user.role.includes('BOSS') }))
        .catch(err => next(err))
})

router.get('/edit-user/:id', (req, res, next) => {
    const userId = req.params.id
    User
        .findById(userId)
        .then(user => res.render('edit', { user, isAdmin: req.user.role.includes('BOSS') }))
        .catch(err => next(err))
})

router.post('/edit-user/:id', (req, res, next) => {
    const userId = req.params.id
    const { name, username, description } = req.body

    User
        .findByIdAndUpdate(userId, { name, username, description })
        .then(() => res.redirect('/users-list'))
        .catch(err => next(err))
})

router.get('/remove-user/:id', (req, res, next) => {
    const userId = req.params.id
    User
        .findByIdAndDelete(userId)
        .then(() => res.redirect('/users-list'))
        .catch(err => next(err))
})

router.get("/signup", ensureAuthenticated, checkRole('BOSS'), (req, res) => res.render("auth/signup"))


router.post("/signup", (req, res, next) => {

    const { name, description, username, password, role } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Fill the blanks" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "User exists" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ name, description, username, password: hashPass, role })
                .then(() => res.redirect('/users-list'))
                .catch(() => res.render("auth/signup", { errorMsg: "There was an error!" }))
        })
        .catch(error => next(error))
})


module.exports = router
