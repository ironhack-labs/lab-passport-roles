const express = require('express')
const router = express.Router()

const Empl = require("../models/empl.model")
const Course = require("../models/course.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport");


// Limitar a unos roles el acceso a una vista
const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })

// router.get('/editor-page', checkRole(['EDITOR', 'ADMIN']), (req, res) => res.render('roles/editor-page', { user: req.user }))
// router.get('/admin-page', checkRole(['ADMIN']), (req, res) => res.render('roles/admin-page', { user: req.user }))


// Registro
router.get("/signup", checkRole(['BOSS']), (req, res) => res.render("auth/signup",{ user: req.user }))

router.post("/signup", (req, res) => {

    const { username, password,role } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { message: "Rellena los campos" })
        return
    }

    Empl.findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { message: "El usuario ya existe" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            Empl.create({ username, password: hashPass, role})
                .then(() => res.redirect('/signup'))
                .catch(() => res.render("auth/signup", { message: "Something went wrong" }))
        })
        .catch(error => next(error))
})


router.get('/profile/:id/delete',checkRole(['BOSS']),(req,res) => {

    const id = req.params.id
  
    Empl.findByIdAndDelete(id)
      .then((x)=> res.redirect('/list'))
      .catch(err => console.log("ha ocurrido un error eliminando de la bbdd",err))
  })

router.get("/createCourse", checkRole(['TA']), (req, res) => res.render("course/createCourse",{ user: req.user }))
router.post("/createCourse", (req, res) => {

    const { name, alumni } = req.body

    if (name === "") {
        res.render("course/createCourse", { message: "Rellena los campos" })
        return
    }

    Course.findOne({ name })
        .then(course => {
            if (course) {
                res.render("course/createCourse", { message: "El usuario ya existe" })
                return
            }
            Course.create({ name, alumni})
                .then(() => res.redirect('/createCourse'))
                .catch(() => res.render("auth/signup", { message: "Something went wrong" }))
        })
        .catch(error => next(error))
})


router.get('/course/:id/delete',checkRole(['TA']),(req,res) => {

    const id = req.params.id
  
    Course.findByIdAndDelete(id)
      .then((x)=> res.redirect('/listCourses'))
      .catch(err => console.log("ha ocurrido un error eliminando de la bbdd",err))
  })



module.exports = router

