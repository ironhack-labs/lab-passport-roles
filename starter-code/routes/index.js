const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const Course = require("../models/Course")
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

// router.get('/profile', (req, res, next) => {
//   const user = req.user
//   if(user.role === "BOSS") return res.render('boss/profileboss', user);
//   return res.render('ta/profile', user)
// });

router.get('/profile', (req, res, next) => {
  const user = req.user
  switch(user.role){
    case "BOSS": return res.render('boss/profileboss', user);
    case "TA": return res.render('ta/profile', user)
    default: return res.render('student/profile', user)
  }
});

router.get('/profile/:id', (req, res, next) => {
  const {id} = req.params
  User.findById(id)
  .then(user => {
    const action = `/update/${id}`
    res.render('boss/newemployee',{user,action})
  }).catch(e => next(e))
});

router.get('/newcourse', isAuth, checkIfIs("TA"), (req, res, next) => {
  const course = {title:""}
  const action = '/newcourse'
  res.render('ta/newcourse',{course, action});
});

router.post('/newcourse', isAuth, checkIfIs("TA"), (req, res, next) => {
  Course.create(req.body)
  .then(course=>{
    // res.json(course)
    res.redirect('/listcourses')
  }).catch(e => next(e))
});

router.get('/deletecourse/:id', isAuth, checkIfIs("TA"), (req, res, next) => {
  const {id} = req.params
  Course.findByIdAndRemove(id)
  .then(course=>{
    res.redirect('/listcourses')
  }).catch(e => next(e))
});

router.get('/updatecourse/:id', isAuth, checkIfIs("TA"), (req, res, next) => {
  const {id} = req.params
  Course.findById(id)
  .then(course => {
    const action = `/updatecourse/${id}`
    res.render('ta/newcourse',{course,action})
  }).catch(e => next(e))
});

router.post('/updatecourse/:id', isAuth, checkIfIs("TA"), (req, res, next) => {
  const {id} = req.params
  Course.findByIdAndUpdate(id,{$set:req.body},{new:true})
    .then(course=>{
      res.redirect('/listcourses')
    }).catch(error=>{
      res.render('ta/newcourse',{user:req.body,error})
    })
});

router.get('/addstudents/:id', isAuth, checkIfIs("TA"), (req, res, next) => {
  const {id} = req.params
  Course.findById(id)
  .then(course => {
    User.find({role:"STUDENT"})
    .then(users=>{
      const action = `/addstudents/${id}`
      res.render('ta/addstudents',{course,users,action})
    }).catch(e => next(e))
  }).catch(e => next(e))
});

router.post('/addstudents/:id/:studentid', isAuth, checkIfIs("TA"), (req, res, next) => {
  const {id,studentid} = req.params
  // req.body['students'] = tiendaId
  Course.findByIdAndUpdate(id,{$push:{students:studentid}})
    .then(course=>{
      res.redirect('/listcourses')
    }).catch(error=>{
      res.render('ta/newcourse',{user:req.body,error})
    })
});

router.post('/newemployee', isAuth, checkIfIs("BOSS"), (req, res, next) => {
  User.register(req.body,"pass1234")
  .then(user=>{
    // res.json(user)
    res.redirect('/list')
  }).catch(e => next(e))
});

router.get('/newemployee', isAuth, checkIfIs("BOSS"), (req, res, next) => {
  const user = {username:"",role:""}
  const action = "/newemployee"
  res.render('boss/newemployee',{user, action});
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
    if(req.user.role === "TA") return res.render('ta/list',{users}) 
    if(req.user.role === "STUDENT") return res.redirect('/listalumni') 
  }).catch(e => next(e))
});

router.get('/listcourses', isAuth, checkIfIs("TA"), (req, res, next) => {
  Course.find()
  .then(courses=>{
    return res.render('ta/listcourses',{courses}) 
  }).catch(e => next(e))
});

router.get('/listalumni', isAuth, checkIfIs("STUDENT"), (req, res, next) => {
  User.find({role:"STUDENT"})
  .then(users=>{
    return res.render('student/listalumni',{users}) 
  }).catch(e => next(e))
});



module.exports = router;
