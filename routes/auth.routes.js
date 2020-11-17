const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10



// -----  LOGIN  -----

// Inicio sesión (renderizado formulario) (GET)
router.get("/inicio-sesion", (req, res) => res.render("auth/login", {errorMsg: req.flash("error")}))

// Inicio sesión (gestión) (POST)
router.post("/inicio-sesion", passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/inicio-sesion",
    failureFlash: true,
    passReqToCallback: true
}))



// -----  SIGNUP  -----

// Añadir empleados (gestión) (POST)
router.post("/add-empleados", (req, res, next) => {

    const {
        username,
        name,
        password,
        profileImg,
        description,
        facebookId,
        role
    } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", {errorMsg: "Rellena todos los campos"})
        return
    }

    User
        .findOne({
            username
        })
        .then(user => {
            if (user) {
                res.render("auth/signup", {errorMsg: "El usuario ya existe"})
                return
            }

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
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", {errorMsg: "Hubo un error"}))
        })
        .catch(error => next(error))
})



// Borrar perfiles (gestión) (POST)
router.post('/eliminar', (req, res) => {

    const userId = req.query.user_id

    User
        .findByIdAndDelete(userId)
        .then(() => res.redirect('/borrar-perfiles'))
        .catch(err => console.log(err))
})



// Editar perfil (gestión) (POST)
router.post('/edit', (req, res) => {

    const userId = req.query.user_id

    if (req.query.role === "BOSS") { // Con Role = BOSS se permite modificar el Role
        const {
            username,
            name,
            password,
            profileImg,
            description,
            facebookId,
            role
        } = req.body

        const salt = bcrypt.genSaltSync(bcryptSalt) // Para volver a hashear la contraseña
        const hashPass = bcrypt.hashSync(password, salt)

        User
            .findByIdAndUpdate(userId, {
                username,
                name,
                password: hashPass,
                profileImg,
                description,
                facebookId,
                role
            })
            .then(userInfo => res.redirect('/'))
            .catch(err => console.log(err))
        return

    } else { // Cuando el Role no es igual a BOSS no se permite modificar el Role

        const {
            username,
            name,
            password,
            profileImg,
            description,
            facebookId
        } = req.body

        const salt = bcrypt.genSaltSync(bcryptSalt) // Para volver a hashear la contraseña
        const hashPass = bcrypt.hashSync(password, salt)

        User
            .findByIdAndUpdate(userId, {
                username,
                name,
                password: hashPass,
                profileImg,
                description,
                facebookId
            })
            .then(userInfo => res.redirect('/'))
            .catch(err => console.log(err))
        return
    }
})



// Cerrar sesión
router.get('/cerrar-sesion', (req, res) => {
    req.logout()
    res.redirect("/inicio-sesion")
})


module.exports = router