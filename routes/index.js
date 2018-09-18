const express = require('express');
const router  = express.Router();
const passport = require('passport')
const User = require ('../models/User')


function checkRole(role){
  return (req,res,next) =>{
    if(req.isAuthenticated() && req.user.role==role){
      next ()
    } else {
      res.redirect('/login')
    }
  }
}


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



//Sign up
router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res, next) => {
  User.register(req.body, req.body.password)
  .then(user => res.redirect('/login'))
  .catch(error => next(error))
})


//Login
router.get ('/login',(req,res,next)=>{
  res.render('login')
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>{
  res.redirect('platform')
})


// New
router.get('/platform', checkRole('BOSS'), (req,res,next)=>{
  User.find()
  .then(users =>{
    res.render("platform", {users})
  })
  
})

router.post ('/platform',(req,res,next)=>{
  User.create(req.body)
  .then(user =>{
    res.redirect('/platform')
  })
})


// New-form

router.get('/platform/new-form', checkRole('BOSS'), (req,res,next)=>{
  res.render("new-form")
})

router.post ('/platform/new-form',(req,res,next)=>{
  User.create(req.body)
  .then(user =>{
    res.redirect('/platform')
  })
})


module.exports = router;
