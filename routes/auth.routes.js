const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('./../models/user.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

router.get("/registro", (req, res) => res.render("auth/signup"))

router.post("/registro", (req, res, next) => {
    const { username, password } = req.body 

    if(!username || !password){
        res.render("auth/signup", {errorMsg: "Rellena todos los campos"})
        return
    }

    User
        .findOne({username})
        .then(user => {
            if(user){
                res.render("auth/signup", {errorMsg: "El usuario ya existe"})
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({username, password: hashPass})
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", {errorMsg: "Hubo un error"}))
        })
        .catch(err => next(err))
})

router.get("/inicio-sesion", (req, res) => res.render("auth/login", {errorMsg: req.flash("error")}))

router.post("/inicio-sesion", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/inicio-sesion",
    failureFlash: true,
    passReqToCallback: true
}))

router.get("/cerrar-sesion", (req, res) => {
    req.logout()
    res.redirect("/inicio-sesion")
})

router.get('/', (req,res) => {
    User
        .find()
        .then(allEmps => res.render('/', {allEmps}))
        .catch(err => console.log(err))
})

router.post('/:empId/delete', (req,res) => {
    User
        .findByIdAndRemove(req.params.empId)
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

router.get('/:empId/edit', (req,res) => {
    User
        .findById(req.params.celebId)
        .then(editEmp => res.render('employees/edit', {editEmp}))
        .catch(err => console.log(err))
});

router.post('/:empId', (req,res) => {
    const {username, password, role} = req.body
    User
        .findByIdAndUpdate(req.params.empId, {username, password, role})
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
});
router


module.exports = router