const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

function isRole(role){
  return function(req,res,next){
    if(role === req.user.role){
      return next()
    }
    return res.redirect('/login')
  } 
}

router.get('/delete/:id', isRole("BOSS"), (req,res,next) => {
  const {id} = req.params
  User.findByIdAndDelete(id)
  .then( response => {
    res.redirect('/auth/employees')
  })
  .catch(err => next(err))
})

router.get('/edit', (req,res,next) => {
  const user = req.user
  res.render('auth/edit', user)
})

router.post('/edit', (req,res,next) => {
  const {username} = req.body
  User.findOneAndUpdate({$set: {username}})
  .then( user => {
    res.redirect('/auth/employees')
  })
  .catch( err => next(err))
})

router.get('/login', (req,res,next) => {
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local'), (req,res,next) => {
  req.app.locals.user = req.user
  const email = req.user.email
  User.findOne({email})
  .then( user => {
    res.send(`Login exitoso ${user.username}`)
  })
  .catch( err => next(err))
})

router.get('/signup', isRole("BOSS"), (req,res,next) => {
  res.render('auth/signup')
})

router.post('/signup', (req,res,next) => {
    User.register(req.body, req.body.password)
    .then( user => {
      res.redirect('/auth/employees')
    })
})

router.get('/employees', (req,res,next) => {
  User.find()
  .then( users => {
    const myUser = req.user.role === "BOSS"
    console.log(myUser)
    res.render('employees/list', {users, myUser})
  })
  .catch(err => {
    next(err)
  })

  router.get('/logout', (req,res,next) => {
    req.logOut()
    res.redirect('/login')
  })
  
})

module.exports = router