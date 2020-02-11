const express = require("express")
const router = express.Router()

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport")

const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })



router.get("/signup", checkRole(["boss"]), (req, res) => res.render("auth/signup-form"))
router.post("/signup", (req, res) => {

  const { username, password, role } = req.body

  if (username === "" || password === "") {
    res.render("auth/signup-form", { message: "Rellena los campos" })
    return
  }
  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/signup-form", { message: "El usuario ya existe" })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hashPass, role })
        .then(() => res.redirect('/'))
        .catch(() => res.render("auth/signup-form", { message: "Something went wrong" }))
    })
    .catch(error => next(error))
})

router.get("/login", (req, res) => res.render("auth/login-form", { message: req.flash("error") }))
router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

// router.get("/logout", (req, res) => {
//   req.logout()
//   res.redirect("/login")
// })

module.exports = router



