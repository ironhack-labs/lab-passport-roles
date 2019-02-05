const express = require('express');
const router  = express.Router();
const User = require("../models/users.js");
const bcrypt = require("bcryptjs");

const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  req.logout();
  res.render('login',{ "message": req.flash("error")});
});

router.post("/login",passport.authenticate("local", {
  successRedirect: "/userAreaBoss",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}),(req,res,next) =>{})


router.get('/userAreaBoss', [ensureLogin.ensureLoggedIn(), checkRole("Boss")], (req, res, next) => {
  User.find()
  .then(users => res.render('areas/areaBoss', {users}))
  .catch(err => console.log(err))
});
router.get('/userAreaDeveloper', [ensureLogin.ensureLoggedIn(), checkRole("Developer")], (req, res, next) => {
  console.log(req.user);
  User.find()
  .then(users => res.render('areas/areaDev',{users:users,user:req.user}))
  .catch(err => console.log(err))
});
router.get('/userAreaTA', [ensureLogin.ensureLoggedIn(), checkRole("TA")], (req, res, next) => {
  res.render('areaTA');
});


router.get('/newUser', [ensureLogin.ensureLoggedIn(), checkRole("Boss")], (req, res, next) => {
  res.render('areas/newUser');
});

router.post('/newUser', [ensureLogin.ensureLoggedIn(), checkRole("Boss")], (req, res, next) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.password, salt);
  User.create({name: req.body.username, pwd:hash, role: req.body.role})
  .then(()=> res.redirect("/userAreaBoss"))
  .catch(err => console.log(err))
});

router.post("/user/:id/delete",[ensureLogin.ensureLoggedIn(), checkRole("Boss")],(req,res,next)=>{
  User.findByIdAndRemove(req.params.id)
  .then(() => res.redirect('/userAreaBoss'))
  .catch(err => {
    console.log(err)
    next();
  })
})

router.get('/edit/:id', [ensureLogin.ensureLoggedIn(), checkRole("Developer")], (req, res, next) => {
  User.findById(req.params.id)
  .then(user => res.render('areas/editUser',{user}))
  .catch(err => console.log(err))
});

router.post('/edit/:id', [ensureLogin.ensureLoggedIn(), checkRole("Developer")], (req, res, next) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.password, salt);
  User.findByIdAndUpdate(req.params.id,{name:req.body.username, pwd: hash, role:req.body.role})
  .then(() => res.redirect('userAreaDeveloper'))
  .catch(err => console.log(err))
});

const arrRoutes = ['/userAreaDeveloper','/userAreaTA','/login'];
let cRoutes = 0;

function checkRole(role){
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect(arrRoutes[cRoutes]);
      cRoutes++;
      if(cRoutes = arrRoutes.length) cRoutes = 0;
    }
  }
}


module.exports = router;
