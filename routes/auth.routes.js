const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', {
    message: 'Unauthorized, please log in to continue'
})

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        } else {
            res.render('auth/login', {
                message: 'Unauthorized, you are not allowed to view this content'
            })
        }
    }
}

router.get("/users-list", checkLoggedIn, (req, res, next) => {

    User.find()
        .then(user => res.render('auth/users-list', {
            user
        }))
        .catch(err => next(err))
})

router.get("/users", checkRole(['BOSS']), (req, res, next) => {

    User.find()
        .then(user => res.render('auth/manage-list', {
            user
        }))
        .catch(err => next(err))
})

router.get("/login", (req, res, next) => res.render("auth/login", {
    "message": req.flash("error")
}))
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get("/users/create", (req, res, next) => res.render("auth/create-user"))
router.post("/users/create", (req, res, next) => {

    const {
        name,
        username,
        password,
        role
    } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/create-user", {
            message: "Please indicate username and password"
        })
        return
    }

    User.findOne({
            username
        })
        .then(user => {
            if (user) {
                res.render("auth/create-user", {
                    message: "The username already exists"
                })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({
                name,
                username,
                password: hashPass,
                role
            })
            User.create()
                .then(() => res.redirect('/'))
                .catch(error => next(error))
        })
        .catch(error => next(error))
})

router.get('/users-list/:users_id/details', (req, res, next) => {

    const id = req.params.users_id

    User.findById(id)
        .then(userDetails => res.render('auth/details', userDetails))
        .catch(err => next(err))
})

router.get('/profile', checkLoggedIn, (req, res, next) => res.render('auth/profile', req.user))

router.get('/profile/:users_id/edit', (req, res, next) => {

    const id = req.params.users_id

    User.findById(id)
        .then(userDetails => res.render('auth/profile-edit', userDetails))
        .catch(err => next(err))
})

router.post('/users/:users_id/delete', (req, res, next) => {

    const id = req.params.users_id

    User.findByIdAndRemove(id)
        .then(() => res.redirect('/users'))
        .catch(err => next(err))
})

module.exports = router