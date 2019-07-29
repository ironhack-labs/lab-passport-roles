const express = require('express')
const router = express.Router()
const ensureLogin = require("connect-ensure-login")

const User = require('../models/user.model')


//user's list
router.get('/list', ensureLogin.ensureLoggedIn(), (req, res, next) => {

  User.find({})
    .then(allUsers => {

      res.render('list', { users: allUsers }
      )
    })
    .catch(err => console.log('Error', err))

})

// see user's profile
router.get('/profile', ensureLogin.ensureLoggedIn(), (req, res, next) => {

  User.find({})
    .then(usersProfile => {

      res.render('profile', { users: usersProfile }
      )
    })
    .catch(err => console.log('Error', err))

})

// router.get("/profile", (req, res, next) => res.render("profile"))

//add users
router.get('/add', (req, res, next) => res.render('add'))
router.post('/user/add', (req, res, next) => {

  const { username, password } = req.body

  User.create({ username, password })
    .then(() => res.redirect('/list'))
    .catch(err => console.log('Error:', err))
})

// edit user

router.get('/edit', (req, res, next) => {

  const userId = req.params.id

  User.findById(req.query.userId)
    .then(theUser => res.render('edit', { theUser }))
    .catch(err => console.log('Error:', err))
})
router.post('/edit', (req, res, next) => {

  const { username, password } = req.body

  User.findByIdAndUpdate(req.query.userId, { $set: { username, password } }, { new: true })
    .then(theNewUser => {
      console.log(theNewUser)
      res.redirect('/list')
    })
    .catch(err => console.log('Error:', err))
})


module.exports = router