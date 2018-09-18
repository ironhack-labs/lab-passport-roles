const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

function checkRole(role, role2, role3) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role || req.user.role === role2 || req.user.role === role3) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}

router.get('/addUser', checkRole('BOSS'), (req, res, next) => {
  res.render('auth/addUser')
})

router.post('/addUser', (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => res.redirect('/login'))
    .catch(error => next(error))
})

// login
router.get('/login', (req, res, next) => {
  res.render('auth/login')
})
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.redirect('/list')
})

// list
router.get('/list', checkRole('BOSS', 'DEVELOPER', 'TA'), (req, res, next) => {
  User.find().then(users => {
    res.render('auth/list', { users })
  })
})

// details
router.get('/details/:id', (req, res, next) => {
  const { id } = req.params

  User.findById(id)
    .then(users => {
      res.render('auth/details', users)
    })
})

// update
router.get('/edit/:id', (req, res, next) => {
  const { id } = req.params
  User.findById(id)
    .then(user => {
      res.render('auth/editUser', user)
    }).catch(e => next(e))
})
router.post('/edit/:id', (req, res, next) => {
  const { id } = req.params
  User.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then(user => {
      res.redirect(`/details/${id}`)
    }).catch(e => next(e))
})
module.exports = router