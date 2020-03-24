const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const bcrypt = require('bcrypt')

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/auth/login')
    }
  }
}
router.get('/list', checkRoles('BOSS'),  (req, res, next) => {
  User.find()
    .then(users => {
      res.render('employee/list', {users} )
    })
})

router.get('/edit/:id', checkRoles('BOSS'), (req, res, next) =>{
  User.findById(req.params.id)
  .then(user => {
    res.render('employee/info', user)
  })
})

router.post('/info/:id', checkRoles('BOSS'), (req, res, next) =>{
  User.updateOne({_id:req.params.id}, {role:req.body.role})
  .then(() => {
    res.redirect('/employee/list')
  })
  .catch(e => {console.log(e)})
})

router.get('/', checkRoles('BOSS'), (req, res, next) => {
  res.render('employee/add')
})

router.post('/add', checkRoles('BOSS'), (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
     return User.create({
      username: req.body.username,
      password: hash,
      role: req.body.role
    })
    .then(user => {
      res.send(user)
    })
    .catch(e => {
      console.log(e)
    })
})
})

router.get('/delete/:id',checkRoles('BOSS'), (req, res, next) =>{
  User.deleteOne({_id:req.params.id})
    .then( () => {
      res.redirect('/employee/list')
    })
    .catch(e => {
      console.log(e)
    })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/auth/login'
}))

module.exports = router;