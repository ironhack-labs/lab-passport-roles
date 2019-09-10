const router = require('express').Router()
const User = require('../models/User')
const catchErrors = (fn) => (req, res, next) => fn(req, res, next).catch(req, res, next)
const passport = require('../config/passport')



router.get('/signup', (req, res, next) => {
  const config = {
    title: 'Sign up',
    action: '/signup',
    button: 'Sign up',
    register: true //esto lo pongo para ponerle al form que muestre el name y el lastname
  }
  res.render('auth/form', config)
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({
      ...req.body
    }, req.body.password) //resgister solo es posible por passport mongoose
    console.log(user)
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.send('El usuario ya existe')
  }
})

router.get('/login', (req, res, next) => {
  const config = {
    title: 'Login',
    action: '/login',
    button: 'login',
  }
  res.render('auth/form', config)
})
//compara passwords y ve si el usuario existe. Local es el tipo de estrategia de passport que está usando, 
//la que tiene email y contraseña. El usuario lo manda a req.user
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  console.log(req.username, req.session)
  res.redirect('/create')
  // res.redirect('/profile')
})


router.get('/create', isLoggedIn, async (req, res, next) => {

  res.render('auth/form-new-user', {
    user: req.user
  })
})

// router.get('/profile', isLoggedIn, (req, res, next) => {
//   // res.render('auth/profile', {
//   //   user: req.user
//   // })
// })

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}
module.exports = router