const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10



// Registro 
router.get("/registro", (req, res) => res.render("auth/signup"))

router.post("/registro", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario ya existe" })
                return
            }


            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "Hubo un error" }))
        })
        .catch(error => next(error))
})




// Inicio sesión
router.get("/inicio-sesion", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))


router.post("/inicio-sesion", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/inicio-sesion",
    failureFlash: true,
    passReqToCallback: true
}))


// Cerrar sesión
router.get('/cerrar-sesion', (req, res) => {
    req.logout()
    res.redirect("/inicio-sesion")
})


//Editar


router.get('/edit', (req, res) => {

    const userId = req.query.user_id

    User
        .findById(userId)
        .then(response => res.render('edit', response))
        .catch(err => res.render(console.log(err)))

})

router.post('/edit', (req, res) => {

    const userId = req.query.user_id   
    // console.log(userId)

    const { username, password, role } = req.body   

    User
        .findByIdAndUpdate(userId, { username, password, role })
        .then(info => res.redirect('edit'))
        .catch(err => console.log(err))
})


//Lista de Usuarias

router.get("/users-list", (req, res) => res.render("users-list"))

//Cambiar Rol

router.get("/roles", (req, res) => res.render("roles"))


module.exports = router