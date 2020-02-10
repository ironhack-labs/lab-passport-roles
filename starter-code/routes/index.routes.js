const express = require('express');
const router  = express.Router();

const checkLoggedIn = (req, res, next) => req.user ? next() : res.render('index', { loginErrorMessage: 'Zona restringida a usuarios registrados' })
const isBoss = user => user.role === 'BOSS'
const isTa = user => user.role === 'TA'

const Empl = require("../models/empl.model")
const Course = require("../models/course.model")


/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get("/profile", checkLoggedIn, (req, res) => res.render("profile", { user: req.user, isBoss: isBoss(req.user),isTa:isTa(req.user) }));

router.get('/profile/:id', checkLoggedIn, (req, res) => {

  const id = req.params.id

  Empl.findById(id)
    .then(theEmpl => res.render('profile-list',theEmpl))
    .catch(err => console.log("Error consultando empleado por ID en la BBDD",err))
})

//

router.get('/list',checkLoggedIn, (req, res) => {
  let theUser = req.user
  Empl.find()
  .then(allEmpls => {
    res.render('list', { isBoss: isBoss(theUser),empls: allEmpls })
    console.log(theUser)
  })
  .catch(err => console.log("Error consultadno las cels en la BBDD: ", err))
  //Aqui me ralle bastante pero por el handlebars, entiendo que no va asi esto montado
})

router.get('/list',checkLoggedIn, (req, res) => {
  let theUser = req.user
  Empl.find()
  .then(allEmpls => {
    res.render('list', { isBoss: isBoss(theUser),empls: allEmpls })
    console.log(theUser)
  })
  .catch(err => console.log("Error consultadno las cels en la BBDD: ", err))
  //Aqui me ralle bastante pero por el handlebars, entiendo que no va asi esto montado
})

router.get('/listCourses',checkLoggedIn, (req, res) => {
  Course.find()
  .then(allCourses => res.render('course/listCourses', { isTa: isTa(req.user),courses: allCourses }))
  .catch(err => console.log("Error consultadno las cels en la BBDD: ", err))
  //Aqui ya esta bien
})





module.exports = router;
