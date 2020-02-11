const express = require('express')
const router = express.Router()
const User = require('../models/user')

const isBoss = user => user.role === "BOSS" ? true : false

// Listado de empleados
router.get('/', (req, res) => {
  User.find()
    .then(allUsers => res.render('employees/index', {
      employee: allUsers,
      isBoss: isBoss(req.user)
    }))
    .catch(err => console.log("Error consultando las empleados en la BBDD: ", err))
})


// // Detalle de empleado

router.get('/details/:employeeId', (req, res) => {

  const employeeId = req.params.employeeId

  User.findById(employeeId)
    .then(emp => res.render('employees/show', emp))
    .catch(err => console.log("Error consultando los detalles del empleado en la BBDD: ", err))
})


//Eliminar empleados


router.get('/delete/:id', (req, res, next) => {

  const employeeId = req.params.id

  User.findByIdAndRemove(employeeId)
    .then(() => res.redirect('/employees'))
    .catch(err => console.log(err))
})

//Editar empleado
router.get('/edit/:employeeId', (req, res) => {

  const employeeId = req.params.employeeId

  User.findById(employeeId)
    .then(emp => res.render('employees/edit', emp))
    .catch(err => console.log(err))
})
router.post('/edit/:employeeId', (req, res) => {

  const employeeId = req.params.employeeId

  // const salt = bcrypt.genSaltSync(bcryptSalt);
  // const hashPass = bcrypt.hashSync(password, salt);

  User.findByIdAndUpdate(employeeId, req.body)
    .then(x => res.redirect(`/employees/details/${employeeId}`))
    .catch(err => console.log(err))
})

module.exports = router