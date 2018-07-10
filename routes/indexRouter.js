const express = require('express');
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');
const router = express.Router();
const User = require("../models/User");



router.get('/',(req,res) => {
    res.render('index');
})




router.get('/cursos', [
    ensureLoggedIn('/auth/login'), 
    hasRole('TA'),
] , (req,res) => {
    res.render('cursos');
})





// RUTAS CRUD EMPLEADOS 

  /* C(R)UD: Add a book form */

router.get('/lista_empleados', [
    ensureLoggedIn('/auth/login'), 
    hasRole('Boss'),
] , (req,res) => {
    User.find({})
    .then( users => {
      res.render("lista_empleados", { users });
    });
})

  
  /* (C)RUD: Add a book form */
  router.get('/empleados/crearEmpleado', (req, res, next) => {
    res.render('/empleados/empleadoUnico');
  });
  

  /* (C)RUD: Create the book in DB */
  router.post('/empleados/crearEmpleado', (req, res, next) => {
    const { username} = req.body;
    new User({username})
    .save().then( user => {
      console.log("Book sucessfully created!");
      res.redirect('/empleados');
    });
  });
  
  /* CR(U)D: Update the book, show update form  */
  router.get('/empleados/editarEmpleado/:id', (req,res) => {
    User.findById(req.params.id).then(user => {
      res.render('empleados/editarEmpleado',{user});;
    })
  })
  
  /* CR(U)D: Update the book in DB */
  router.post('/empleados/editarEmpleado/:id', (req,res) => {
    const {username} = req.body;
    User.findByIdAndUpdate(req.params.id,{username})
        .then( user => {
          res.redirect('/lista_empleados')
        })
  })
  
  /* CRU(D): Update the book in DB */
  router.get('/empleados/delete/:id',(req,res) => {
    User.findByIdAndRemove(req.params.id, () => res.redirect('/books'));
  })
  
  





module.exports = router;




