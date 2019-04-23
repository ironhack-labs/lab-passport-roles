const express = require('express');
const router  = express.Router();
const User = require ('../models/User')
const passport = require('../helpers/passport')
const { isLogged, checkRole } = require('../helpers/middlewares')


/* GET home page */
router.get('/', (req, res, next) => {    //get home 
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  const config = {
    title: 'Log in!',
    action: '/signup'
  }
  res.render('signup', config)
})

router.post('/signup', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) next(err)
    if(!user) return res.render('signup', {err: 'You are unauthorized.', title: 'Log in!', action:'/signup'})
    req.logIn(user, err => {
      if(err) return next(err)
      req.app.locals.loggedUser = req.user
      res.redirect(`/${user.rol.toLowerCase()}`)
    })
  })(req, res, next)
})



module.exports = router;


