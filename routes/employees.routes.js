
const express = require('express')
const router = express.Router()
const User = require("../models/user.model")

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: "Desautorizado, no tienes permisos" })


router.get('/private-employee-list', ensureAuthenticated, checkRole(['BOSS', 'DEV', 'TA']), (req, res) => {
    User
        .find({}, { name: 1, role: 1 })
        .sort({ name: 1 })
        .then(employees => {
            console.log(req.user)
            res.render('employees', { employees })
        })
})
// router.get('/employees', (req, res) => {
//     User
//         .find({}, { name: 1, role: 1 })
//         .sort({ name: 1 })
//         .then(employees => {
//             console.log(req.user)
//             res.render('employees-list', { employees })
//         })
// })

//ELIMINAR
router.get('/employees/delete/:id', (req, res) => {
    const employeeId = req.params.id
    User
        .findByIdAndDelete(employeeId)
        .then(() => res.redirect('/private-employee-list'))
})

//EDITAR
router.get('/employees/edit/:id', (req, res) => {


    const employeeId = req.params.id

    User
        .findById(employeeId)
        .then(Employee => {
            res.render("edit", Employee)
        })
})

router.post('/employees/edit/:id', (req, res) => {

    const { name, role } = req.body
    const employeeId = req.params.id
    User
        .findByIdAndUpdate(employeeId, { name, role })
        .then(() => res.redirect('/employees'))
        .catch(err => console.log('Error:', err))
})

module.exports = router
