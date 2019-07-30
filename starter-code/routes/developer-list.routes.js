const express = require('express')
const router = express.Router()

const User = require('../models/User.model')


// Listado de developers

router.get('/list', (req, res, next) => {
  User.find({})
    .then(allTheUsers =>{ 
      console.log(allTheUsers)
      res.render('developer-list', { users: allTheUsers })
  
  })  // ojo! pasar obj
    .catch(err => console.log('Hubo un error:', err))
})



// Creación user 
router.get('/create', (req, res, next) => res.render('developers-add'))
router.post('/create', (req, res, next) => {

  //console.log(req.body)


  const { username, password } = req.body

  User.create({ username, password})
    .then(() => res.redirect('//list'))
    .catch(err => console.log('Hubo un error:', err))
})



// Edición de users

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
module.exports = router