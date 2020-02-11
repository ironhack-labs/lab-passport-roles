const express = require('express')
const router = express.Router()

const Employee = require('../models/user')

const isBoss = user => user && user.role === "BOSS";
const isDeveloper = user => user && user.role === "DEVELOPER";
const isTa = user => user && user.role === "TA";




router.get('/', (req, res) => {
  Employee.find()
    .then(allEmployees => res.render('employees/index', {
      employees: allEmployees,
      isBoss: isBoss(req.user),
      isDeveloper: isDeveloper(req.user),
      isTa: isTa(req.user)
    }))
    .catch(err => console.log("Error consultando la BBDD: ", err))
})

// router.get('/details/:id', (req, res) => {

//   const employeeId = req.params.id

//   Employee.findById(employeeId)
//     .then(theEmployee => res.render('celebrities/show', theEmployee))
//     .catch(err => console.log("Error consultando en la BBDD: ", err))
// })

const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", {
  roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí`
})

router.get('/new', checkRole(['BOSS']), (req, res) => res.render('employees/new'))
router.post('/new', (req, res) => {

  const {
    username,
    password,
    role
  } = req.body

  Employee.create({
      username,
      password,
      role
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// Edición de empleados
router.get('/edit', (req, res) => {

  const employeeId = req.query.id
  console.log('EmployeeId =', employeeId)
  Employee.findById(employeeId)
    .then(theEmployee => res.render('employees/edit', theEmployee))
    .catch(err => console.log(err))
})
router.post('/edit/:employeeId', (req, res) => {
  console.log("EL Id que llega como URL param es:", req.params.employeeId)
  const employeeId = req.params.employeeId

  Employee.findByIdAndUpdate(employeeId, req.body)
    .then(x => res.redirect(`/employees`))
    .catch(err => console.log(err))
})

// Borrado de empleados
router.post('/:id/delete', (req, res) => {

  const employeeId = req.params.id
  console.log(employeeId)

  Employee.findByIdAndDelete(employeeId)
    .then(() => res.redirect('/employees'))
    .catch(err => console.log("Error borrando el famoso en la BBDD: ", err))

})


module.exports = router