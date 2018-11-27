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

router.get('/newemployee', isAuth, checkIfIs("BOSS"), (req, res, next) => {
  res.render('boss/newemployee');
});

router.post('/newemployee', isAuth, checkIfIs("BOSS"), (req, res, next) => {
  User.register(req.body,"pass1234")
  .then(user=>{
    // res.json(user)
    res.redirect('/list')
  }).catch(e => next(e))
});

router.get('/deleteemployee/:id', isAuth, checkIfIs("BOSS"), (req, res, next) => {
  const {id} = req.params
  User.findByIdAndRemove(id)
  .then(user=>{
    res.redirect('/list')
  }).catch(e => next(e))
});

router.get('/list', isAuth, checkIfIs("BOSS"), (req, res, next) => {
  User.find()
  .then(users=>{
    res.render('list',{users})
  }).catch(e => next(e))
});

module.exports = router;
