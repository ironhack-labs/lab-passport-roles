const express = require('express')
const router = express.Router()
const User = require('../models/user.model')
const Course = require('../models/course.model')
 const bcrypt = require('bcrypt')
 const bcryptSalt = 10
 const passport = require('passport')
 const ensureLogin = require("connect-ensure-login")

const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", {
  roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí`
})



router.get('/private', checkRole(['admin']), (req, res) => res.render('passport/private'))
router.post("/private", (req, res) => {
  const {
    username,
    password,
    role
  } = req.body

  if (username === "" || password === "") {
    res.render("passport/signup-form", {
      message: "Rellena los campos, no se van a rellenar solos..."
    })
    return
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render("passport/signup-form", {
          message: "El usuario ya existe, ten más imaginación..."
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({
          username,
          password: hashPass,
          role
        })
        .then(() => res.redirect('/'))
        .catch(() => res.render("passport/signup-form", {
          message: "Algo ha ido mal, no se qué pero ha ido mal..."
        }))
    })
    .catch(error => next(error))
})




router.get('/TA', checkRole(['developer', 'admin']), (req, res) => res.render('passport/TA'))
router.post('/TA', (req, res) => {

  const {
    name,
    time,
    description,
  } = req.body

  Course.create({
      name,
      time,
      description
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})






module.exports = router