const express = require('express');
const router = express.Router();
const passport = require("passport")
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Restricted area, please, log in.' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Restricted area, you are not allowed in.' })

//REGISTRO
router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

    if (username.length === '' || password.length === '') {
        res.render('auth/signup', { errorMsg: "Fill all the gaps" })
    }
    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/signup', { errorMsg: "This user is already existing" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.render(('index'), { successMsg: "New user created" }))
                .catch(() => res.render('auth/signup', { errorMsg: "There was a mistake, please, try again" }))
        })
        .catch(error => next(error))
})

//NUEVO PERFIL DESDE BOSS
router.get('/new-profile', (req, res) => {
    res.render('auth/new-profile')
})

router.post('/new-profile', (req, res, next) => {
    const { username, password } = req.body

    if (username.length === '' || password.length === '') {
        res.render('auth/new-profile', { errorMsg: "Fill all the gaps" })
    }
    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/new-profile', { errorMsg: "This user is already existing" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.render(('auth/profile'), { successMsg: "New user created" }))
                .catch(() => res.render('auth/new-profile', { errorMsg: "There was a mistake, please, try again" }))
        })
        .catch(error => next(error))
})

//LIST OF EMPLOYEES FOR EDITING
router.get('/admin-edit', (req, res) => {
    User
        .find()
        .then(allUsers => {
            res.render('auth/admin-edit', { allUsers })
        })

        .catch(err => console.log(err))
})
//LIST OF EMPLOYEES FOR REMOVING
router.get('/admin-delete', (req, res) => {
    User
        .find()
        .then(allUsers => {
            res.render('auth/admin-delete', { allUsers })
        })

        .catch(err => console.log(err))
})

//DETAILS

router.get('/show/:id', (req, res) => {

    const employeeId = req.params.id

    User
        .findById(employeeId)
        .then(theEmployee => res.render('auth/show', theEmployee))
        .catch(err => console.log(err))
})

//LOGIN
router.get('/login', (req, res) => {
    res.render('auth/login', { errorMsg: req.flash("error") })
})

router.post('/login', passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

//EDIT (NO CONSEGUIDO)

router.get('/edit/:id', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA']), (req, res) => {
    const userId = req.params.id
    

    User
        .findById(userId)
        .then(() => res.render('auth/edit', { user: req.user, isBoss: req.user.role.includes('BOSS') }))
        .catch(err => console.log(err))
})

router.post('/edit/:id', (req, res) => {
    const userId = req.params.id
    const { name, username, role } = req.body

    User
        .findByIdAndUpdate(userId, { name, username, role } )
        .then(() => res.redirect('/profile'))
        .catch(err => console.log('Error:', err))

})

//DELETE
router.post('/:id/delete', ensureAuthenticated, checkRole(['BOSS']), (req, res) => {

    const userId = req.params.id

    User
        .findByIdAndRemove(userId)
        .then(() => res.redirect('/admin-delete'))
        .catch(err => console.log(err))
})

//LOGOUT
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})


module.exports = router;