const express = require('express');
const router  = express.Router();
const modelUser = require('../models/roles')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const salt = 10
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const ensureLogin = require("connect-ensure-login");
const flash = require('connect-flash')
const modelCourses = require('../models/courses')

const passportFacebook = require('passport-facebook')
const FacebookStrategy = passportFacebook.Strategy




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
  res.render('index');
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
    res.render('/')
  })

  
})



router.get("/boss", checkBoss, (req, res) => {

  modelUser.find({})
  .then((data)=>{
    
    res.render("../views/boss", {data});

  })
});

router.get("/eliminate-course/:id", checkTA, (req, res) => {

 
  const id = req.params.id
  console.log("asdf")
  console.log(id)
 
  modelCourses.findByIdAndDelete(id)
  .then(()=>{
    console.log("Eliminado con exito")
    res.redirect('/create-course')
  })


});

router.get('/edit-course/:id', (req,res,next)=>{

  const id = req.params.id


  modelCourses.findById(id)
  .then((data)=>{
    res.render('edit-course',{data})
  })


  

 

})


router.post('/edit-course',(req,res,next)=>{

const id = req.body.id
const name = req.body.name
const description = req.body.description

  modelCourses.findByIdAndUpdate(id,{name: name, description: description})
  .then(()=>{
    console.log("Modificado con exito")
    res.redirect('/create-course')
    
  })



})





router.get('/delete/:id',(req,res,next)=>{

  const id = req.params.id
  console.log(id)
  modelUser.findByIdAndDelete(id)
  .then(()=>{
    console.log("Eliminado con exito")
  })
    
})


router.get('/edit/:id',(req,res,next)=>{

  const id = req.params.id

  modelUser.findById(id)
  .then((data)=>{

    res.render('../views/edit',{data})
  })
    
})


router.post('/edit', (req,res,next)=>{

  const id = req.body.id
  const username = req.body.username

  modelUser.findByIdAndUpdate(id,{username: username})
  .then(()=>{
    console.log("Modificado con exito")
  })

})


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


//Facebook 




passport.use(new FacebookStrategy({
  clientID: "324095571558623",
  clientSecret: "fbb8653ae44bc60d489755a8ed809f4f",
  callbackURL: "/return"
},

function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}
));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


router.use(passport.initialize());
router.use(passport.session());


router.get('/auth/facebook',passport.authenticate('facebook'));

router.get('/return', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
   console.log(res)
    res.render('alumni',{user: req.user});
  });



  router.get('/alumni',require('connect-ensure-login').ensureLoggedIn(),(req,res,next)=>{

    res.render('alumni')

  })






module.exports = router;
