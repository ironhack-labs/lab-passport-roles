const express = require('express')
const router = express.Router()

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })

router.get('/myprofile', checkRole(['Boss', 'Developer', 'TA']), (req, res) => {
    console.log(req.user)
    res.render('user/my-profile', req.user)
})

router.get('/profile/:id', checkRole(['Boss', 'Developer', 'TA']), (req, res) => {
    console.log("INvoca a la funcion ", req.params.id)
    User.findById(req.params.id)
        .then(user => res.render('user/profile', user))
        .catch(err => console.log(err))
})  //______________________________________Falta meter un error en la pantalla



//EDITING PROFILE
router.post('/:id/update', (req, res) => {

    const { username, password, role } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup-form", {
            message: "Rellena los campos"
        })
        return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User.findByIdAndUpdate(req.params.id, {
        username,
        password: hashPass,
        role
    })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

//router.get('/profile', checkId, (req, res) => res.render('roles/editor-page', { user: req.user }))


module.exports = router


