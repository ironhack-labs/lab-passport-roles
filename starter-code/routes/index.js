const express = require('express');
const passport = require('../handlers/passport')
const router  = express.Router();
const User = require('../models/User')
const { isLogged, checkRole } = require('../handlers/middlewares')
const Employees = require('../models/employees')
const Course = require('../models/courses')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  const config = { action: '/signup', title: 'Sign up' }
  res.render('sign', config)
})

router.get('/login', (req, res, next) => {
  const config = { action: '/login', title: 'Log in' }
  res.render('sign', config)
})

router.post('/signup', (req, res, next) => {
  User.register({ ...req.body, role: 'BOSS' }, req.body.password)
    .then(user => {
      res.redirect('/login')
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.redirect('/login')
    req.logIn(user, err => {
      if (err) return next(err)
      req.app.locals.loggedUser = req.user
      res.redirect('/account')
    })
  })(req, res, next)
})

router.get('/account', isLogged, (req, res, next) => res.render('account'))

router.get('/boss', isLogged, checkRole('BOSS'), (req, res, next) => {
  res.render('boss')
})

router.get('/boss', (req, res, next) => res.render('boss'))

router.post('/boss', (req, res, next) => {
  Employees.create({ ...req.body })
    .then(data => {
      res.send(data)
      res.redirect('/employees')
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/employees', (req, res, next) => res.render('employees'))

router.get('/employees', (req, res, next) => {
  Employees.find()
    .then(data => {
      res.render('/employees', { data })
    })
    .catch(err => {
      res.send(err)
    })
})

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  (req, res, next) => {
    res.redirect('/courses')
  }
)

router.get('/courses', isLogged, /*checkRole('TA'),*/ (req, res, next) => {
  res.render('courses')
})

router.post('/courses', (req, res, next) => {
  Course.create({ ...req.body })
    .then(data => {
      res.send(data)
      res.render('allcourses', { data })
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/allcourses', isLogged, /*checkRole('TA'), */(req, res, next) => {
  res.render('allcourses')
})

router.get('/allcourses', (req, res, next) => {
  Course.find()
    .then(data => {
      res.render('/allcourses', { data })
    })
    .catch(err => {
      res.send(err)
    })
})

module.exports = router;
