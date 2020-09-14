const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10



router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res, next) => {

  const { username, password } = req.body

  if (username.length === 0 || password.length === 0) {
    res.render("auth/signup", { message: "Indicate username and password" })
    return
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/signup", { message: "The username already exists" })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

router.get("/login", (req, res) => res.render("auth/login", { "message": req.flash("error") }))
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))
router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")
})


router.get('/logout', (req, res, next) => {
  req.logout()
  res.render('auth/login', { message: 'Sesión cerrada' })
})


//ver empleados--------------------------------------------------------------
router.get('/empleados', (req, res) => {
  User.find()
  .then(user => res.render('auth/empleados', {user}))
  .catch(err => console.log('ERROR:', err))

})

router.get("/new", (req, res, next) => res.render("auth/new"))
router.post("/new", (req, res, next) => {

  const { name, password ,username} = req.body

  if (username.length === 0 || password.length === 0) {
    res.render("auth/new", { message: "Indicate username and password" })
    return
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/new", { message: "The username already exists" })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then(() => res.redirect('/empleados'))
        .catch(error => next(error))
    })
    .catch(error => next(error))
})


module.exports = router