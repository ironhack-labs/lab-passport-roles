const router = require('express').Router()
const User = require('../models/User')
const passport = require('../handlers/passport')
const { isLogged, checkRole } = require('../handlers/middlewares')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

//LOGIN
router.get('/login', (req, res, next) => {
  const config = { action:'/login', title: 'Log in'}
  res. render('login', config)
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.redirect('/login')
    req.logIn(user, err => {
      if (err) return next(err)
      req.app.locals.loggedUser = req.user
      res.redirect('/panel-boss')
    })
  })(req, res, next)
})

//PANEL BOSS
router.post('/panel-boss', isLogged, checkRole('BOSS'), (req, res, next) => res.render('panel-boss'))

router.post('/panel-boss/delete', (req, res, next) => {
  const {id} = req.body
  User.findById(id)
  .then(user => res.redirect('/panel-boss'))
  .catch(err => console.log(err))
})
//PANEL DEV
//PANEL TA
//PANEL ALUMNI

module.exports = router; //CREAR SEEDS CON PRIMER USUARIO Y ROL ADMIN
