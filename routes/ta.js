const express = require('express')
const router = express.Router()
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

router.get('/', checkRole('TA'), (req, res, next)=>{
  res.render('ta/profile')
})

//detalle

router.get('/detail/:id', (req, res, next)=>{
  res.render('boss/detail')
})

//agregar

router.get('/new', (req, res, next)=>{
  res.render('boss/new')
})

//update

router.get('/edit/:id', (req, res, next)=>{
  res.render('boss/edit')
})


router.get('/delete/:id', (req, res, next)=>{
  res.render('boss/delete')
})


module.exports = router