const express = require("express")
const router = express.Router()

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport");

// Listado de usuarios
router.get('/list', (req, res) => {
  console.log('entra en list')

  User.find()
    .then(oneUser => res.render('auth/list', { users: oneUser }))
    .catch(err => console.log("Error consultadno los empleados en la BBDD: ", err))
})

// Limitar a BOSS el acceso al alta de usuarios
const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })

router.get('/signup', checkRole(['BOSS']), (req, res) => res.render('auth/signup', { user: req.user }))


// Registro
router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { message: "No ves que esta to vacio..." })
        return
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { message: "No te repitas, ya tienes este usuario" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { message: "La hemos jodido" }))
        })
        .catch(error => next(error))
})

// Limitar a BOSS el acceso al alta de usuarios
router.get('/:id/delete', checkRole(['BOSS']), (req, res) => res.render('/', { user: req.user }))

// Eliminar usuario
router.post('/:id/delete', (req, res) => {
  const usersId = req.params.id

  Users.findByIdAndRemove(usersId)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


router.get("/login", (req, res) => res.render("auth/login", { message: req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router