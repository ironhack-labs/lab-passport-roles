const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })
// const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })

const checkRole = rolesToCheck => {
    return (req, res, next) => {
        if (req.isAuthenticated() && rolesToCheck.includes(req.user.role)) {
            next()
        }
        else {
            res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })
        }
    }
}



const bcrypt = require("bcrypt")
const bcryptSalt = 10



// router.get("/users-create", checkRole(['BOSS']),(req, res, next) => res.render('platform/create-user'))





module.exports = router