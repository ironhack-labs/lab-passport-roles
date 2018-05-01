const express = require('express')
const router = express.Router();
const User = require('../models/User')
const passport = require('passport')

const checkRole = (req, res, next) => {
User.findOne({username : req.body.username})
.then(user=>{
  console.log(user)
  if(user.role === "BOSS"){
    return next();
  }
  res.send('no tienes acceso');
})
.catch(e=> console.log(e));
}

router.post('/signup', (req,res)=>{
  if(req.body.password1 !== req.body.password2){
    req.body.error = "Contraseñas incorrectas";
    return res.render('./auth/signup', req.body)
  }
  User.register(req.body, req.body.password1, (err, user)=>{
    if (err) return next(err);
      //res.send('funciono')
      res.redirect("/login")
  })
})
router.get('/signup', (req,res)=>{
  res.render("./auth/signup")
})
router.get ('/login', (req,res)=>{
  res.render("./auth/login")
})
router.post('/login', 
checkRole, 
passport.authenticate("local"), 
(req,res,next)=>{
  //res.send('Tienes acceso')
  res.redirect('/signup')
})


module.exports = router;