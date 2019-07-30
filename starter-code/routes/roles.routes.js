const express = require('express');
const router = express.Router();

const User = require('../models/User.model')

const checkRoles = (role) => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { msg: `Necesitas ser un ${role} para acceder aquí` })

router.get('/developer', checkRoles("DEVELOPER"), (req, res, next) => res.render('roles/developer'));
router.get('/ta', checkRoles("TA"), (req, res, next) => res.render('roles/ta'));
router.get('/boss', checkRoles("BOSS"), (req, res, next) => {
  res.render('boss/private')
  next()
});

// Creación de nuevo empleado

router.get('/boss/new-employee',(req,res,next)=>{
  res.render('boss/new-employee')
}) 

//Lista de empleados para eliminar

router.get('/boss/delete-employee',(req,res,next)=>{
  User.find({})
  .then(allTheUsers=>res.render('boss/delete-employee',{users: allTheUsers}))
  .catch(function(err){
    next()
    console.log('Hubo un error',err)
  })
})

  // Edición de libro
  router.post('/delete/:id', (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
      .then(() => res.redirect('/boss'))
      .catch(function(err){
        next()
        console.log('Hubo un error:', err)
      })
  })
  
  

//router.get('/new', (req, res, next) => res.render('boss/new-employee'))
router.post('/new', (req, res, next) => {

  const { username, password, role } = req.body

  User.create({ username, password, role })
    .then(() => res.redirect('/boss'))
    .catch(function(err){
      next()
      console.log('Hubo un error:', err)
    })
  })

module.exports = router;