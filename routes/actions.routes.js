const express = require("express")
const router = express.Router()

const app = require('../app')

const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const User = require("../models/user.model")

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })

const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })

//--------------------------------------------------ALL EMPLOYEES------------------------------------------------------

router.get('/', ensureAuthenticated, (req, res) => {
    User
        .find({ role: ["DEV", "TA", "STUDENT"] }, { name: 1, role: 1 })
        .then(response => {
            console.log(response)
            res.render('possible-actions', { user: req.user, isBoss: req.user.role.includes('BOSS'), isDev: req.user.role.includes('DEV'), isTa: req.user.role.includes('TA'), isStudent: req.user.role.includes('STUDENT'), isGuest: req.user.role.includes('GUEST'), response })
            //res.render('employees/index', { response })
        })
        .catch(err => console.log(err))
});
//---------------------------------------------------ADD EMPLOYEE--------------------------------------------------------

router.get('/new', ensureAuthenticated, (req, res) => res.render('auth/signup', { isBoss: req.user.role.includes('BOSS') }))


//--------------------------------------------------DETAILS EMPLOYEES-------------------------------------

router.get('/details/:employee_id', (req, res) => {

    const employeeId = req.params.employee_id

    User
        .findById(employeeId)
        .then(response => {
            console.log(response)
            res.render('employees/show', { user: req.user, isBoss: req.user.role.includes('BOSS'), isDev: req.user.role.includes('DEV'), isTa: req.user.role.includes('TA'), isStudent: req.user.role.includes('STUDENT'), isGuest: req.user.role.includes('GUEST'), response })
        })
        //.then(response => res.render('employees/show', response))
        .catch(err => console.log(err))
});

//--------------------------------------------------DELETE EMPLOYEE------------------------------------------------------

router.post('/details/:employee_id/delete', (req, res) => {

    const employeeId = req.params.employee_id

    User
        .findByIdAndDelete(employeeId)
        .then(() => res.redirect('/actions'))
        .catch(err => console.log(err))
});

//--------------------------------------------EDIT PROFILE--------------------------------------------------------

router.get('/edit', (req, res) => {

    const profileId = req.query.profile_id

    User
        .findById(profileId)
        .then(response => res.render('users/edit', response))
        .catch(err => console.log(err))
})

router.post('/edit', (req, res) => {

    const profileId = req.query.profile_id

    const { username, name, password } = req.body

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)


    User
        .findByIdAndUpdate(profileId, { username, name, password: hashPass })
        .then(() => res.redirect('/profiles'))
        .catch(err => console.log(err))
});


module.exports = router