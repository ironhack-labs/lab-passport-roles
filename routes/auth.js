const express = require ('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');



router.get('/login', (req, res)=>{
  res.render('./auth/login');
})

const checkRole = (req, res, next)=>{
  User.findOne({username: req.body.username})
  .then(user=>{
    if(user.role ==="BOSS"){
      console.log(user)
    return next();
    }
    // res.send('no hay acceso');
  }).catch(e=> console.log(e))
  }


router.post('/signup', (req, res)=>{
  if(req.body.password1 !== req.body.password2){
  req.body.error = "Tu password no coincide"
  return res.render("./auth/signup", req.body);
 }
  User.register(req.body, req.body.password1, function(err, user) {
    console.log(err)
    if (err) return next();
      res.send('loggeado');
  });
})

router.get('/signup', (req, res)=>{
  res.render('./auth/signup')
});

router.get('/boss', (req,res)=>{
  res.render('boss')
})

router.post('/login',
checkRole, (req,res,next)=>{
  res.redirect('/signup')
})

module.exports =  router;
