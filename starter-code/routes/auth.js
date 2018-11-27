const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

//middleware para verificar roles
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/auth/login')
    }
  }
}
const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTa  = checkRoles('TA');

router.get('/update/:id',(req,res,next)=>{

  const id = req.user._id
  const action = `/auth/update/${id}`
  User.findById(id)
  .then(user=>{
    res.render('auth/signup',{user,action})
  }).catch(e=>{
    next(e)
  })
 })
 
 router.post('/update/:id',(req,res,next)=>{
  const id = req.user._id
  User.findByIdAndUpdate(id,{$set:req.body},{new:true})
  .then(user=>{
    res.redirect(`/auth/detail/${id}`)
  }).catch(error=>{
    res.render('auth/signup',{user:req.body,error})
  })
 })


router.get("/logout", (req, res, next) => {
  req.logOut();
  res.redirect("/auth/login");
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  const username = req.user.username;
 const id = req.user._id
  res.redirect('/auth/detail/${id}');
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get('/detail/:id',(req,res, next)=>{
  const id = req.user._id
  User.findById(id)
  .then(user=>{
    res.render('auth/detail',user)
  }).catch(e=>next(e))
 })


router.get('/signup', (req,res,next)=>{
  const action = `/auth/signup`
  res.render('auth/signup', {action})
})

router.post("/signup", (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => {
      res.json(user);
    })
    .catch(e => next(e));
});

router.get('/new',checkBoss, (req,res,next)=>{
  res.render('auth/new')
})

router.post("/new", (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => {
      res.json(user);
    })
    .catch(e => next(e));
});

router.get('/private', checkBoss, (req,res, next)=>{
  User.find()
  .then(usuarios=>{
    res.render('private',{usuarios}) 
  }).catch(e=>next(e))
})

router.get('/delete/:id', chechBoss ,(req,res,next)=>{
  const {id}= req.params
  User.findByIdAndRemove(id)
  .then(usuarios=>{
    res.redirect('/auth/private')
  }).catch(e=>next(e))
})

module.exports = router