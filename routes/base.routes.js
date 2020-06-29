const express = require('express')
const router = express.Router()

const passport = require('passport')

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.redirect('/login')



//ADD

router.get("/add", checkRole(['BOSS']),(req, res) => res.render("auth/add"))
router.post("/add" ,checkRole(['BOSS']),(req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/add", { errorMessage: "Por favor, no dejes campos vacíos!" });
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if ( user) {
                res.render("auth/add", { errorMessage: "Usuario ya existente" });
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            return User.create({ username, password: hashPass })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log("Error:", err))
        .catch(err => console.log("Error:", err))
})


//EMPLOYEES LIST

router.get('/employees', (req, res) => {

    User
        .find()
        .then(allEmployees => {
            console.log(allEmployees)

            res.render('auth/employees', {allEmployees})})
        .catch(err => console.log("Error en la BBDD", err))
})

router.post('/employees/delete/:id', checkRole(['BOSS']), (req, res) => {

    User
        .findByIdAndRemove(req.params.id)
        .then(res.redirect('/employees'))
        .catch(err => console.log("Error al borrar el registro", err))


})


router.get('/employees/details/:id', checkRole(['BOSS', 'DEV', 'TA', 'STUDENT', 'GUEST']), (req, res) => {

    User
        .findById(req.params.id)
        .then(theUser => res.render('auth/details', theUser))
        .catch(err => console.log("Error en la BBDD", err))
})


router.get('/employees/edit/:id', checkRole(['BOSS', 'DEV', 'TA']), (req, res) => {

    User
    .findById(req.params.id)
    .then(theUser => {
        res.render('auth/edit', theUser)})
    .catch(err => console.log("Error en la BBDD", err))

})

router.post('/employees/edit/:id', (req, res) => {

    const { username, name, profileImg, facebookId, description, role } = req.body
    User
        .findByIdAndUpdate(req.params.id, {username, name, profileImg, facebookId, description, role}, { new: true })
        .then(() => res.redirect('/employees'))
        .catch(err => console.log("Error en la BBDD", err))
})


router.get('/employees/changeRole/:id', checkRole(['BOSS']), (req, res) => {
    
    User
    .findById(req.params.id)
    .then(theUser => res.render('auth/changeRole', theUser))
    .catch(err => console.log("Error en la BBDD", err))

})

router.post('/employees/changeRole/:id', (req, res) => {

    const {role } = req.body

    User
        .findByIdAndUpdate(req.params.id, {role}, { new: true })
        .then(() => res.redirect('/employees'))
        .catch(err => console.log("Error en la BBDD", err))
})


module.exports = router
