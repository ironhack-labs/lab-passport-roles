let router = require('express').Router()
let User = require('../models/User')


router.get('/', (req,res,next)=>{
  User.find()
  .then(users => {
    res.render('gm/gm', {users})
  })
  .catch(err =>{
    req.app.locals.error = e
  })
})


router.get('/signup', (req,res,next)=>{
  res.render('gm/signup')
})

router.post('/signup', (req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(()=>res.redirect('/gm'))
  .catch(e=>{
    req.app.locals.error = e
    res.redirect('/gm')
  })
})



module.exports = router