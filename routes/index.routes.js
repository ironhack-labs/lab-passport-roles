const express = require('express');
const router = express.Router();
const passport = require('passport')


const User = require("../models/User.model")

const bcrypt = require('bcrypt')
const bcryptSalt = 10


//Detector de usuario
const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect("/login")

const checkRole = role => (req, res, next) => req.isAuthenticated() && req.user.role.includes(role) ? next() : res.render("auth/login", { errorMsg: 'Área restringida' })

/* GET home page */
router.get('/', (req, res, next) => res.render('index'))
router.get('/profile', ensureLoggedIn, (req, res) => res.render('profile', req.user))

router.post('/profile/:id', ensureLoggedIn, (req, res, next) => {
    User.updateOne({_id:req.params.id}, {role:req.body.role})
    .then(() => res.redirect('/empleados'))
    .catch(err => console.log(`Error al actualizar perfil ${err}`))

})


router.get('/course', checkRole('BOSS'), (req, res) => res.render('cursos'))

router.get('/employees', checkRole('BOSS'), (req, res, next) => {
    User.find()
        .then(users => {
            res.render('empleados', { users })
        })
        .catch(err => console.log(`Error al buscar empleados ${err}`))
}) 

router.get('/admin', checkRole('BOSS'), (req, res) => res.render('admin'))
router.get('/admin/add', checkRole('BOSS'), (req, res, next) =>  res.render('employees/add'))
router.post('/add', checkRole('BOSS'), (req, res, next) => {

    User.findOne(req.body.username)
        .then(user => {
            if(user) {
            res.render('auth/signup', {errorMsg: 'El usuario ya existe'})
            return
            }

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)

        User.create({
            username: req.body.username,
            password: hashPass,
            role: req.body.role
            })
            .then((user) => res.send(user))
            .then(() => res.redirect('/'))
            .catch(() => res.render('auth/signup', {errorMsg: "No se pudo crear el usuario"}))
    })
    .catch(err => console.log(`Error al buscar nombre de usuario antes de crearlo ${err}`))

})

router.get('/admin/list', checkRole('BOSS'), (req, res, next) => {
    User.find()
        .then(users => {
        res.render('employees/list', { users })
        })
        .catch(err => console.log(`Error al buscar empleados para lista admin ${err}`))
})

router.get('/admin/edit/:id', checkRole('BOSS'), (req, res, next) => {
    User.findById(req.params.id)
    .then(user => {
        res.render('employees/edit', user)
    })
    .catch(err => console.log(`Error al buscar empleado con id ${err}`))
})

router.post('/admin/edit/:id', checkRole('BOSS'), (req, res, next) => {
    User.updateOne({_id:req.params.id}, {role:req.body.role})
    .then(() => {
        res.redirect('/employees/list')
    })
    .catch(err => console.log(`Error actualizar empleado ${err}`))
})

router.get('/delete/:id', checkRole('BOSS'), (req, res, next) => {
    User.deleteOne({_id:req.params.id})
    .then(() => res.redirect('/employeea/list'))
    .catch(err => console.log(`Error al eliminar empleado ${err}`))

})

module.exports = router;