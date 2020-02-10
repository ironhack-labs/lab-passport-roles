const express = require('express')
const router = express.Router()

const Employee = require('../models/user')

const isBoss = user => user && user.role === "BOSS";


router.get('/', (req, res) => {
  Employee.find()
    .then(allEmployees => res.render('employees/index', {
      employees: allEmployees,
      isBoss: isBoss(req.user)
    }))
    .catch(err => console.log("Error consultando la BBDD: ", err))
})

// router.get('/details/:id', (req, res) => {

//   const celebrityId = req.params.id

//   Celebrity.findById(celebrityId)
//     .then(theCelebrity => res.render('celebrities/show', theCelebrity))
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

// Borrado de famosos
router.post('/:id/delete', (req, res) => {

  const employeeId = req.params.id

  Celebrity.findByIdAndDelete(employeeId)
    .then(() => res.redirect('/employees'))
    .catch(err => console.log("Error borrando el famoso en la BBDD: ", err))

})


module.exports = router