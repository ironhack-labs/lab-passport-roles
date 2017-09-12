const express = require("express");
const siteController = express.Router();
const passport = require('passport')
const User = require('../models/User')
const Course = require('../models/Course')
const bcrypt = require('bcrypt')
const bcryptSalt = 10

siteController.get("/", (req, res, next) => {
  if(req.isAuthenticated()){
  User.find({}, (err, users)=>{
    if(err){return next(err)}
    else{
      res.render("index", {users : users, identity: req.user});
    }
  })
}else{
  res.redirect('login')
}
})

siteController.get('/login',(req,res, next)=>{
  res.render('login',{ message: req.flash("error")} );
})

siteController.get('/private', checkRoles('BOSS'), (req, res)=>{
  User.find({}, (err, users)=>{
    if(err){return next(err)}
    else{
      res.render("private", {users : users, user: req.user});
    }
  })
})

siteController.post('/login', passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/delete/:id",(req,res,next)=>{
  const id = req.params.id;
  User.findByIdAndRemove(id, (err, user)=>{
    return res.redirect("/private");
  })
})

siteController.get("/add",checkRoles('BOSS'),(req,res,next)=>{
  res.render("newEmployee")
})

siteController.post('/add',checkRoles('BOSS'),(req, res, next)=>{
  const userName = req.body.username
  if(req.body.username =="" || req.body.password == ""){
    res.render("newEmployee", { message: "Indicate User Name and Password" });
    return;
  }
  User.findOne({ userName }, "username", (err, user) => {
    if (user !== null) {
      res.render("newEmployee", { message: "The username already exists" });
      return;
    }
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt)
  const newUser = new User({
    username : req.body.username,
    name : req.body.name,
    familyName : req.body.familyName,
    role: req.body.role,
    password : hashPass
  })
  .save()
  .then(user =>res.redirect('/private'))
  .catch(e => res.render('newEmployee', {message: "Something went worng"}))
})
})

siteController.get('/profile/:id',(req, res, next)=>{
  User.findOne({ _id : req.params.id},(err,user)=>{
      res.render('profile', {u: user, identity : req.user})
  })
})

siteController.get('/edit/profile/:id',(req,res, next)=>{
  User.findOne({ _id : req.params.id},(err,user)=>{
      res.render('editProfile',{u:user});
  })
})

siteController.post('/edit/profile/:id',(req,res,next)=>{
  const profileId = req.user._id
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt)

  const updates = {
    name : req.body.name,
    password : hashPass,
    username : req.body.username,
    familyName : req.body.familyName,
    role : req.user.role
  }

  User.findByIdAndUpdate(profileId, updates, (err, user)=>{
    if(err){return next(err)}

    return res.redirect('/')
  })
})
siteController.get('/logout',(req,res) =>{
  req.logout();
  res.redirect("/login");
});
siteController.get('/courses',checkRoles("TA"),(req, res, next)=>{
  Course.find({}, (err, courses)=>{
    if(err){return next(err)}
    else{res.render("list",{courses : courses})}
  })
})
siteController.get('/delete/course/:id',(req, res, next )=>{
  const id = req.params.id;
  Course.findByIdAndRemove(id, (err, user)=>{
    return res.redirect("/courses");
  })
})
siteController.get('/edit/course/:id',(req, res, next) =>{
  Course.findOne({ _id : req.params.id},(err,course)=>{
      res.render('editCourse',{course:course});
  })
})
siteController.get('/view/course/:id',(req, res, next)=>{
  Course.findOne({ _id : req.params.id},(err,course)=>{
      res.render('courseDetails', {c: course})
  })
})
siteController.post('/edit/course/:id',checkRoles('TA'), (req, res, next)=>{
  const courseId = req.params.id
  const updates = {
    name : req.body.name,
    startingDate : new Date(req.body.startingDate),
    endDate : new Date(req.body.endDate),
    level : req.body.level,
    available : req.body.available
  }
  Course.findByIdAndUpdate(courseId, updates, (err, course)=>{
    if(err){return next(err)}

    return res.redirect('/courses')
  })
})
siteController.get('/create',checkRoles('TA'),(req,res,next)=>{
  res.render('newCourse')
})
siteController.post('/add/course',(req,res,next)=>{
  const courseName = req.body.name;
  if(courseName === ""){
    res.render('newCourse', {errorMessage: "Please add a name to the course"})
    return
  }
  Course.findOne({ name : courseName}, (err, course)=>{
    if(course != null){
      res.render('newCourse', {errorMessage : "That course already exists"})
      return;
    }
    const newCourse = new Course({
      name : req.body.name,
      startingDate : new Date(req.body.startingDate),
      endDate : new Date(req.body.startingDate),
      level : req.body.level,
      available : req.body.available
    })
    .save()
    .then(course =>{res.redirect('/courses')})
    .catch(e =>{res.render('newCourse', {errorMessage: "Unexpected Error"})})
  })
})



function checkRoles(role){
  return function(req, res, next){
    if (req.isAuthenticated() && req.user.role === role){
      return next()
    }else{
      res.redirect("/")
    }
  }
}
module.exports = siteController;
