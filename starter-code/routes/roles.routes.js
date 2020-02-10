const express = require('express')
const router = express.Router()
const User = require('../models/user.model')


// const checkRole = roles => (req, res, next) => {
//     if (req.user && roles.includes(req.user.role)) {
//         return next()
//     }
//     else {
//         res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })
//     }
// }



// Limitar a unos roles el acceso a una vista
const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })

router.get('/signup-boss', checkRole(['BOSS']), (req, res) => res.render('roles/signup-roles', { user: req.user }))

router.get('/employes-list',checkRole(['BOSS']), (req, res, next) => {
    User.find()
    .then(allemployes => res.render('roles/employes-list',{employes: allemployes}))
    .catch(err => console.log("Error consultando los empleados en la BBDD: ", err))
  })

// Borrado de empleados
router.post('/delete/:id' , (req,res) => {
  
  const employeId = req.params.id

  User.findByIdAndDelete(employeId)
  .then(() => res.redirect('/employes-list'))
  .catch(err => console.log("Error borrando el empleado en la BBDD: ", err))

})


module.exports = router