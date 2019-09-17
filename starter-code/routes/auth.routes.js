require('dotenv').config();
const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/Users');




const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
   res.render('auth/signup');
});

router.post('/signup',(req,res,next)=>{

  const username=req.body.username
  const password=req.body.password
  const role=req.body.role

  console.log(username)
  console.log(password)
  console.log(role)

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Please indicate username and password' });
    return;
  }

  User.findOne({username}).then((user)=>{
    if(user){
      res.render('auth/signup', { message: 'Username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass=bcrypt.hashSync(password,salt)

    const newUser= new User({
      username,
      password:hashPass,
      role:role,
    })

    newUser.save()
      .then((x)=>res.redirect('/private'))
      .catch(error=>next(error))
  })
    .catch(error => next(error))
})

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local-auth',{
  successRedirect: `/private`,
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}))

router.get('/private',(req,res,next)=>{
  
  User.find().then((employees)=>{
   
    if (req.user.role == "BOSS")
      res.render('auth/private', { boss: true, employees })
    else
      res.render('auth/private', { employee: true,employees})
  })
  
})

router.get('/delete/:id',(req,res,next)=>{
  var idDel = req.params.id
  console.log(idDel)
  User.findByIdAndDelete(req.params.id).then((x)=>{
    res.redirect('/private')
  })



  
})





module.exports=router