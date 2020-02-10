const express = require("express")
const router = express.Router()
const passport = require("passport")
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const User = require("../models/user.model")

//Registro
router.get("/signup", (req, res) => res.render("auth/signup-form"))
router.post("/signup", (req, res) => {

  const {
    username,
    password
  } = req.body

  if (username === "" || password === "") {
    res.render("auth/signup-form", {
      message: "Hazme el favor de rellenar los campos por dios te lo pido."
    })
    return
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render("auth/signup-form", {
          message: "El usuario ya existe, tendrás que luchar a muerte para quedarte con la propiedad"
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({
          username,
          password: hashPass
        })
        .then(() => res.redirect('/'))
        .catch(() => res.render("auth/signup-form", {
          message: "Something went wrong"
        }))
    })
    .catch(error => next(error))
})

// Iniciar sesion

router.get("/login", (req, res) => res.render("auth/login-form", {
  message: req.flash("error")
}))
router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

// Cerrar sesión
router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")
})


module.exports = router