const express = require('express');
const router = express.Router();
const User = require('../../models/user.model')

const bcrypt = require("bcrypt")
const bcryptSalt = 10
//const checkRole=require('../aux/checkRoles')
const checkRole = role => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/auth/login')
    }
  }
}
const checkBoss = checkRole('Boss');
/* const checkDeveloper = checkRole('Developer');
const checkTA = checkRole('TA'); */

/* GET home page */
router.get('/', checkBoss,(req, res, next) => {
  User.find()
  .then(users=>{
      res.render('boss/users',{users});
  })

})
router.get('/add-user', checkBoss,(req, res, next) => {
  res.render('boss/add-user');
})

router.post('/add-user', checkBoss,(req, res, next) => {
  const {username, role}= req.body
  const defaultPass='1234'

  if (!username){
    res.render("boss/add-user", {
      message: 'Introduce un username'
    })
    return
  }
   if (!role) {
     res.render("boss/add-user", {
       message: 'Selecciona un puesto'
     })
     return
   }

  User.findOne({username})
  .then(user=>{
    if (user){
      res.render("boss/add-user", {
        message: 'El usuario ya existe'
      })
      return
    }
    
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(defaultPass, salt)
    
    const newUser = new User({username, password: hashPass, role})

    newUser.save()
    .then(user => {
     console.log('usuario creado:', user);
     res.redirect("/manage")
   })
  })
  .catch(err => {
    res.render("boss/add-user", {
      message: 'No se ha podido añadir el usuario, intentalo de nuevo'
    })
    return
  })


});

router.get('/:id/delete', checkBoss, (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
  .then(x=>res.redirect('/manage'))
})
module.exports = router;
