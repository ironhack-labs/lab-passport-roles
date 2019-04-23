const express = require('express');
const router  = express.Router();
const passport = require('../handlers/passport')
const User = require('../models/User')
const Ironhacker = require('../models/Ironhacker')
const { isLogged, checkRole } = require('../handlers/middlewares.js')


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  const config = {
    title: 'Log in',
    action: '/login'
  }
  res.render('./auth/login', config)
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) next(err)
    if(!user) return res.render('./auth/login', {err: 'Warning you are not an Ironhacker! If you try to hack us again Papu may and will hack your Facebook!', title: 'Log in!', action:'/login'})
    req.logIn(user, err => {
      if(err) return next(err)
      req.app.locals.loggedUser = req.user
      res.redirect(`/${user.role.toLowerCase().replace(/\s/g, "-")}`)
    })
  })(req, res, next)
})

router.get('/the-boss', isLogged, checkRole('The Boss'), (req, res, next) => {
  User.find({ "role": { "$ne": 'The Boss' } })
    .then(users => res.render('./the-boss/', { users }))
    .catch(err => console.log(err))
})

router.get('/the-boss/add', isLogged, checkRole('The Boss'), (req, res, next) => {
  res.render('./the-boss/add')
})

router.post('/the-boss/add', isLogged, checkRole('The Boss'), (req, res, next) => {
  const { username, password } = req.body
  if(username === '' || password === '') return res.render('./the-boss/add', {message: "What's up Boss? You must fill all fields!"})
  User.create({ ...req.body })
    .then(data => {
      res.send(data)
    })
    .then(user => res.redirect('/the-boss'))
    .catch(err => {
      console.log(err)
    })
})

router.post('/the-boss/delete', (req, res, next) => {
  const { id } = req.body
  User.findByIdAndDelete(id)
    .then(user => res.redirect('/the-boss'))
    .catch(err => console.log(err))
})
//Ironhackers
router.get('/ironhackers', (req, res, next) => res.render('ironhackers'))

router.get('/ironhackers', (req, res, next) => {
  Ironhacker.find()
    .then(data => {
      res.render('/ironhackers', { data })
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})


module.exports = router;