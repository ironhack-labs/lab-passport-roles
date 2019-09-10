const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

router.get('/signup', (req, res, next) => {
  const config = {
    title: 'Sign Up',
    action: '/signup',
    button: 'Sign Up',
    register: true //Switches the register fields name and lastName on
  }
  res.render('secure/form', config)
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password)
    res.redirect('/login')
  }
  catch (err) {
    console.log(err)
    res.send('User already exists')
  }
})

router.get('/login', (req, res, next) => {
  const config = {
    title: 'Login',
    action: '/login',
    button: 'Log In',
    register: false,
  }
  res.render('secure/form', config)
})


// router.post('/login', (req, res, next) => {

//   passport.authenticate('local'), (req, res, next) => {
//     successRedirect: '/profile',
//       failureRedirect: '/login'
//   }
// })


router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.redirect('/profile');
    });
  })(req, res, next);
});


router.get('/profile', ensureLogin.ensureLoggedIn(), async (req, res, next) => {
  const users = await User.find().populate()
  if (req.user.role === 'TA') {
    res.render('secure/profile-TA', { user: req.user, users })
  } else if (req.user.role === 'BOSS') {
    res.render('secure/profile-Boss', { user: req.user, users })
  } else {
    res.render('secure/profile', { user: req.user, users })
  }
})


router.get('/create-user', (req, res, next) => {
  const config = {
    title: 'Create User',
    action: '/create-user',
    button: 'Create',
    register: true //Switches the register fields name and lastName on
  }
  res.render('secure/form', config)
})



router.post('/create-user', async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password)
    res.redirect('/profile')
  }
  catch (err) {
    console.log(err)
    res.send('User already exists')
  }
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router