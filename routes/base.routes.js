const express = require('express')
const router = express.Router()

const User = require('../models/user.model')
const bcrypt = require("bcrypt")
const bcryptSalt = 10

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', {
    message: 'Desautorizado, incia sesión para continuar'
})

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        } else {
            res.render('auth/login', {
                message: 'Desautorizado, no tienes permisos para ver eso.'
            })
        }
    }
}

// Endpoints
router.get('/', (req, res) => res.render('index'))

router.get("/users/new", checkRole(["BOSS"]), (req, res, next) => res.render("auth/new"))

router.post("/users/new", checkRole(["BOSS"]), (req, res, next) => {
    const {
        username,
        name,
        password,
        profileImg,
        description,
        facebookId,
        role
    } = req.body

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)


    User.create({
            username,
            name,
            password: hashPass,
            profileImg,
            description,
            facebookId,
            role
        })
        .then(() => res.redirect('/users'))
        .catch(err => next(err))

})

router.post("/users/:user_id/delete", checkRole(["BOSS"]), (req, res, next) => {
    const id = req.params.user_id
    User.findByIdAndDelete(id)
        .then(() => res.redirect("/users"))
        .catch((err) => console.log("ERROR:", err));
});

router.get('/users', checkLoggedIn, (req, res, next) => {

    User.find()
        .then(users => res.render("auth/users", {
            users
        }))
        .catch(err => next(err))

})


router.get('/users', checkRole(["BOSS"]), (req, res, next) => {
    User.find({
            "role": {
                $ne: "BOSS"
            }
        })
        .then(users => res.render("auth/users", {
            users
        }))
        .catch(err => next(err))

})

module.exports = router