const express = require('express');
const router  = express.Router();
const modelUser = require('../models/roles')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const salt = 10
const passport = require('passport')
const modelCourses = require('../models/courses')



mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

  function checkRoles(role) {
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.redirect('/login')
      }
    }
  }

const checkTA  = checkRoles('TA');
const checkDeveloper = checkRoles('Developer');
const checkBoss  = checkRoles('Boss');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('login');
});

router.get('/signup', checkBoss, (req,res,next)=>{
  res.render('signup')
})

router.post('/signup', (req,res,next)=>{

  const username = req.body.username
  const password = req.body.password
  const role = req.body.role

  const saltHass = bcrypt.genSaltSync(salt)
  const hasPass = bcrypt.hashSync(password,saltHass)

  const newUser = {
    username: username,
    password: hasPass,
    role: role
  }

  modelUser.create(newUser)
  .then(()=>{

    res.render('../views/boss')
  })
  
})

router.get("/boss", checkBoss, (req, res) => {

  modelUser.find({})
  .then((data)=>{
    
    res.render("../views/boss", {data});

  })
});

router.get('/create-course', checkTA, (req,res,next)=>{

  modelCourses.find({})
  .then((data)=>{
    
    res.render('../views/courses', {data})
  
  })

})


router.post('/create-course', checkTA, (req,res,next)=>{

  const course = req.body

  console.log(course)

  modelCourses.create(course)
  .then(()=>{
    console.log("Creado")
    res.redirect('/create-course')
    
  })

})




router.get('/login',(req,res,next)=>{
  res.render('../views/login')
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}));





module.exports = router;
