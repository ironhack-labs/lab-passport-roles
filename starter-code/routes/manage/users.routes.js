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

const isBoss = (req, res) => {
  if (req.user.role === "Boss") return true
}
/* GET home page */
router.get('/view/users', (req, res, next) => {
  User.find() //{role: {$ne:'Boss'}}
  .then(users=>{
    if(isBoss(req,res)){
      console.log({
        users,
        boss: true
      })
      res.render('users', {
        users,
        boss: true
      })
    return
    }
    res.render('users', {
      users,
      boss: false
    })
      
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
     res.redirect("/manage/view/users")
   })
  })
  .catch(err => {
    res.render("boss/add-user", {
      message: 'No se ha podido añadir el usuario, intentalo de nuevo'
    })
    return
  })


});

router.get('/:id/delete', checkBoss, (req, res) => {
  User.findByIdAndDelete(req.params.id)
  .then(x=>res.redirect('/manage'))
})


router.get('/edit', (req,res)=>{
  User.findById(req.user._id)
  .then(
    res.render('profile/edit', {
      user: req.user
    })
  )
  .catch(err=>console.log(err))
  
})
router.post('/edit', (req,res)=>{
const {username, password}= req.body
let hashPass

if(password){
  const salt = bcrypt.genSaltSync(bcryptSalt)
  hashPass = bcrypt.hashSync(password, salt)
}
else hashPass=req.user.password

  User.findByIdAndUpdate(req.user._id, {
    username,
    password: hashPass
  }, {new: true})
  .then(user=>{
    console.log(user)
    res.render('profile/my-account', {user})
  }
  )
  .catch(err=>console.log(err))
  
})
module.exports = router;
