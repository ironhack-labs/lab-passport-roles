const express = require('express');
const router  = express.Router();
const passport = require('../handlers/passport')
const User = require('../models/User')
const { isLogged, checkRole } = require('../handlers/middlewares.js')


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  const config = {
    title: 'Log in!',
    action: '/login'
  }
  res.render('./auth/login', config)
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) next(err)
    if(!user) return res.render('./auth/login', {err: 'You are unauthorized.', title: 'Log in!', action:'/login'})
    req.logIn(user, err => {
      if(err) return next(err)
      req.app.locals.loggedUser = req.user
      res.redirect(`/${user.rol.toLowerCase()}`)
    })
  })(req, res, next)
})

router.get('/boss', isLogged, checkRole('BOSS'), (req, res, next) => {
  User.find({ "rol": { "$ne": 'BOSS' } })
    .then(users => res.render('./boss/all', { users }))
    .catch(err => console.log(err))
})

router.get('/boss/add', isLogged, checkRole('BOSS'), (req, res, next) => {
  res.render('./boss/add')
})

router.post('/boss/add', isLogged, checkRole('BOSS'), (req, res, next) => {
  const { username, password } = req.body
  if(username === '' || password === '') return res.render('./boss/add', {message: 'User and password cannot be empty'})

  User.register({ user, rol }, req.body.password)
    .then(user => {
      passport.authenticate('local', (err, user, info) => {
        if(err) return next(err)
        if(!user) return res.redirect('/login')
        req.logIn(user, err => {
          if(err) return next(err)
          res.redirect('/boss')
          next()
        })
      })(req, res, next)  
    })  
    .catch(err => {
      console.log(err)
    })
})

router.post('/boss/delete', (req, res, next) => {
  const { id } = req.body
  User.findByIdAndDelete(id)
    .then(user => res.redirect('/boss'))
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})



module.exports = router;
