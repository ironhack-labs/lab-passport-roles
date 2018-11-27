const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const passport = require('passport')

function checkIfIs(role){
  return function(req, res, next){
    if(req.user.role === role) return next()
    return res.redirect('/profile')
  }
}

function isAuth(req, res, next){
  if(req.isAuthenticated()) return next()
  return res.redirect('/auth/login')
}

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
  // res.send("hola")
  // User.register({username:"boss",role:"BOSS"},"admin")
  // .then(user=>{
  //   res.json(user)
  // })
  // .catch(e => next(e))
});

router.get('/profile', (req, res, next) => {
  const user = req.user
  if(user.role === "BOSS") return res.render('boss/profileboss', user);
  return res.render('ta/profile', user)
});

router.get('/profile/:id', (req, res, next) => {
  const {id} = req.params
  User.findById(id)
  .then(user => {
    const action = `/update/${id}`
    res.render('boss/newemployee',{user,action})
  }).catch(e => next(e))
});

router.get('/newemployee', isAuth, checkIfIs("BOSS"), (req, res, next) => {
  const user = {username:"",role:""}
  const action = "/newemployee"
  res.render('boss/newemployee',{user, action});
});

router.post('/newemployee', isAuth, checkIfIs("BOSS"), (req, res, next) => {
  User.register(req.body,"pass1234")
  .then(user=>{
    // res.json(user)
    res.redirect('/list')
  }).catch(e => next(e))
});

router.post('/update/:id', isAuth, (req, res, next) => {
  const {id} = req.params
  User.findByIdAndUpdate(id,{$set:req.body},{new:true})
    .then(user=>{
      res.redirect('/list')
    }).catch(error=>{
      res.render('boss/newemployee',{user:req.body,error})
    })
});

router.get('/deleteemployee/:id', isAuth, checkIfIs("BOSS"), (req, res, next) => {
  const {id} = req.params
  User.findByIdAndRemove(id)
  .then(user=>{
    res.redirect('/list')
  }).catch(e => next(e))
});

router.get('/list', isAuth, (req, res, next) => {
  User.find()
  .then(users=>{
    if(req.user.role === "BOSS") return res.render('boss/bosslist',{users})
    return res.render('ta/list',{users}) 
  }).catch(e => next(e))
});

module.exports = router;
