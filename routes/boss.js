const express = require('express')
const router = express.Router()
const User = require('../models/User')
//Restaurant

function checkRole(role){
  return (req,resp,next)=>{
    if(req.isAuthenticated() && req.user.role===role){ 
    next()
  }else{
    res.redirect('/login')
  }
 }
}

//lista

router.get('/lista', checkRole('BOSS'), (req, res, next)=>{
  User.find()
  .then(users => {
    console.log(users)
    res.render('boss/employees', {users})
  })
  .catch(e => console.log(e))
})

//detalle

router.get('/detail/:id', (req, res, next)=>{
  res.render('boss/detail')
})

//agregar

router.get('/new', (req, res, next)=>{
  res.render('boss/new')
})

router.post('/new', (req, res, next) => {
  User.register(req.body, req.body.password)
  .then(user => res.redirect('/lista'))
  .catch(error => next(error))
})
//update

router.get('/edit/:id', (req, res, next)=>{
  res.render('boss/edit')
})


router.get('/delete/:id', (req, res, next)=>{
  res.render('boss/delete')
})


module.exports = router