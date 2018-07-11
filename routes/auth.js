const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      res.redirect('/' + req.user._id + '/profile')
  }else{
      next();
  }
}

router.get('/logout', (req,res,next)=>{
  req.logout();
  res.send('cerrado ??? ');
});

router.get('/login', isLoggedIn, (req,res)=>{
  res.render('auth/login')
});

router.post('/login', passport.authenticate('local'), (req,res,next)=>{
  req.app.locals.usuario = req.user;
  res.redirect('/' + req.user._id + '/profile');
});


router.get('/signup', (req,res)=>{
  res.render('auth/signup');
});

router.post('/signup', (req,res,next)=>{

  User.register(req.body, req.body.password)
  .then(user=>res.redirect('/login'))
  .catch(e=>next(e));
})

module.exports = router;