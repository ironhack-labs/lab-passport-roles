const express = require('express');
const router = express.Router();
const User = require('../models/User.model')

const checkRoles = (role) => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { msg: `Necesitas ser un ${role} para acceder aquí` })

// router.get('/DEVELOPER', checkRoles("DEVELOPER"), (req, res, next) => res.render('/developer'));
// router.get('/list', checkRoles("TA"), (req, res, next) => res.render('./roles/ta'));




//HACER SALI LA LISTA EN LA PAGINA DE TAs Y PERMITIR MODIFICAR  
router.get('/TA', checkRoles("TA"), (req, res, next) => {
  User.find({})
    .then(allTheUsers =>{ 
      console.log(allTheUsers)
      res.render('./roles/ta', { users: allTheUsers })
  
  })  // ojo! pasar obj
    .catch(err => console.log('Hubo un error:', err))
})




// router.get('/BOSS', checkRoles("BOSS"), (req, res, next) => res.render('./roles/boss'));


// router.get('/create', (req, res, next) => res.render('developers-add'))
// router.post('/create', (req, res, next) => {

//   //console.log(req.body)




//   User.create({ username, password})
//     .then(() => res.redirect('//list'))
//     .catch(err => console.log('Hubo un error:', err))
// })


//HACER SALI LA LISTA EN LA PAGINA DE BOSS Y PERMITIR MODIFICAR  PONER Y QUITAR USERS


router.get('/BOSS', checkRoles("BOSS"), (req, res, next) => {
  User.find({})   // PARA HACE SALIR LA LISTA
    .then(allTheUsers =>{ 
      console.log(allTheUsers)
      res.render('./roles/boss', { users: allTheUsers })
  
  })
  .catch(err => console.log('Hubo un error:', err))
  })

// PARA CREAR LA USERS EN LA LISTA-------------- preguntar
  router.get('/create', (req, res, next) => res.render('./roles/boss'))
  router.post('/create', (req, res, next) => {
  
  
    const { username, password } = req.body
  
    User.create({ username, password})
      .then(()=> res.redirect('/list'))                                         // .then(() => res.redirect('//list'))
      .catch(err => console.log('Hubo un error:', err))
  })


// PARA EDITAR USERS EN LA LISTA 

  router.get('/edit', (req, res, next) => {
    //console.log(req.query)
    User.findById(req.query.userId)
      .then(theUser => res.render('user-edit', { theUser }))
      .catch(err => console.log('Hubo un error:', err))
  })
  router.post('/edit', (req, res, next) => {
  
    const { username , password} = req.body
  
    
    User.findByIdAndUpdate(req.query.userId, { $set: { username, password} }, { new: true })
      .then(theNewUser => {
        console.log(theNewUser)
        res.redirect('/developer/list')
      })
      .catch(err => console.log('Hubo un error:', err))
  })


  //PARA ELIMINAR USERS DE LA LISTA     ----------------PREGUNTAR QUE TENGO DUDAS
  router.delete('/erase', (req, res, next) => {
    //console.log(req.query)
    User.findById(req.query.userId)
      .then(theUser => res.render('user-erase', { theUser }))
      .catch(err => console.log('Hubo un error:', err))
  })
  router.post('/erase', (req, res, next) => {
  
    const { username , password} = req.body
  
    
    User.findByIdAndUpdate(req.query.userId, { $set: { username, password} }, { new: true })
      .then(theEraseUser => {
        console.log(theEraseUser)
        res.redirect('/developer/list')
      })
      .catch(err => console.log('Hubo un error:', err))
  })











// Listado de developers

router.get('/list', (req, res, next) => {
  User.find({})
    .then(allTheUsers =>{ 
      console.log(allTheUsers)
      res.render('developer-list', { users: allTheUsers })
  
  })  // ojo! pasar obj
    .catch(err => console.log('Hubo un error:', err))
})

module.exports = router;




// router.get('/list', (req, res, next) => {
//   User.find({})
//     .then(allTheUsers =>{ 
//       console.log(allTheUsers)
//       res.render('developer-list', { users: allTheUsers })
  
//   })  
//     .catch(err => console.log('Hubo un error:', err))
// })