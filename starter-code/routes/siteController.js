const express = require("express");
const siteController = express.Router();
const passport = require('passport')
const ensureLogin= require("connect-ensure-login");
const Users = require("../models/user");

//const Courses = require("../models/course")

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("passport/login");
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: '/private',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback:true
}));

siteController.get("/private", ensureLogin.ensureLoggedIn(), (req, res, next) => {
Users.find().exec((err,user) => {
    res.render("private",{
      id:req.user.id,
      name:req.user.name , 
      role: req.user.role,
      user:user,
    
    });
});
siteController.get('/new', (req, res) => {
  res.render('new');
});

siteController.post('/new', (req, res) => {
  const {name,familyName,password,role} = req.body;
  const user = new Users({name,familyName,password,role});
  user.save( err => {
    if (err) { return next(err) }
    res.redirect('/');
  })
});
siteController.get('/update/:id', (req,res) => {
  const userId = req.params.id;
  Users.findById(userId, (err, user) => {
    if (err) { return next(err); }
    res.render('update', { user: user });
  });
})
siteController.post('/update/:id', (req,res) => {
  const userId = req.params.id;
  const {name,familyName,password,role} = req.body;
  const updates = {name,familyName,password,role};

  Users.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    return res.redirect('/');
  });
})

});


module.exports = siteController;
