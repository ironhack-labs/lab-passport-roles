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


/* GET home page */
router.get('/login', (req, res, next) => {
  res.render('auth/login');
  // res.send("hola")
  // User.register({username:"boss",role:"BOSS"},"admin")
  // .then(user=>{
  //   res.json(user)
  // })
  // .catch(e => next(e))
});

router.post('/login', passport.authenticate("local",{failureRedirect:"/auth/login"}), (req, res, next)=>{
  const username = req.user.username
  req.app.locals.user = req.user
  res.redirect('/auth/profile')
})

router.get('/profile', (req, res, next) => {
  const user = req.user
  res.render('profileboss', user);
});

router.get('/newemployee', (req, res, next) => {
  res.render('newemployee');
});

router.post('/newemployee', (req, res, next) => {
  User.register(req.body,"pass1234")
  .then(user=>{
    res.json(user)
  }).catch(e => next(e))
});

router.get('/list', checkIfIs("BOSS") (req, res, next) => {
  User.find()
  .then(users=>{
    res.render('list',{users})
  }).catch(e => next(e))
});
module.exports = router;
