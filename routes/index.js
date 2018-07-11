
const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

//middlewheres:

function isLoggedIn (req,res,next) {
  if(req.user) return next();
  return res.redirect('/login');
}

function direccionar (req,res,next){
  if (req.user.role === "Boss") return next();
  if (req.user.role === "TA") return res.redirect('/ta');
  return res.redirect('/developers');
}

function checkta (req,res,next){
  if(req.user.role === "Boss" || req.user.role ==="TA") return next();
  return res.redirect('/developers');
}

const checkRole = (role) => (req, res, next) => { 
   if (!req.user) return res.redirect('/login');
   if (req.user.role === role) return next();
   return direccionar(req,res);
}

// function isAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     console.log(req.user)
//     return next()
//   } else {
//     res.redirect('/login');
//   }
// }

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     res.redirect('/private')
//   } else {
//     next();
//   }
// }

// const checkRole = (role) => (req, res, next) => { //Una función devuelve una función cuando es necesario
//   if (!req.isAuthenticated()) return res.redirect('/login');
//   if (req.user.role === role) return next();
//   return res.send('no tienes permiso');
// };

//rutas:

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => res.redirect('/login'))
    .catch(e => next(e));
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post('/login', passport.authenticate('local'), checkRole("Boss"), (req,res,next)=>{ //passport.authenticate verifica la forma en que te autentificaste, en este caso local. Nos ayuda a guardar en req.user
 res.redirect('/private')
});

router.get("/private", isLoggedIn, checkRole("Boss"), (req, res) => {
  User.find({})
  .then(users=>{
    res.render("private", {users});
  })
  .catch(e=>console.error);
});

router.get('/ta', isLoggedIn, checkta, (req, res) => {
  User.find({role:{ $ne:'Boss'}})
  .then(users => {
   res.render('ta', { users });
  })
  .catch(e => console.error);
});

router.post('/ta',(req,res,next)=>{
  User.findByIdAndUpdate(req.params.id, { passport: req.body.password});
  res.send('cambiaste tu contraseña')
});

router.get('/developers', isLoggedIn, (req,res)=>{
  User.find({})
  .then(users=>{
    res.render("developers",{users});
  })
  .catch(e=>console.error);
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.send('cerrado ??? ');
});

//delete
router.get('/:id/delete', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      res.send('Borrado user: ' + req.params.id);
    });
});

/* GET home page */
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
