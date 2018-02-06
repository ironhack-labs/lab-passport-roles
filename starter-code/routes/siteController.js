const express = require("express");
const siteController = express.Router();
// User model
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req,res, next)=>{
  res.render("passport/login");
})

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id, (err, user) => {
    if (err){ return next(err); }
    return res.redirect('/private');
  });
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/post')
    }
  }
}

siteController.get('/private', checkRoles('Boss'), (req, res) => {
  User.find().exec((err, user) => {
    res.render('private', {
      name: req.user.name ,
      role: req.user.role,
      user: user,
    });
  });
});

siteController.get('/post', checkRoles('developer'), (req, res) => {
  User.find().exec((err, user) => {
    res.render('public', {
      id:req.user.id,
      name: req.user.name ,
      role: req.user.role,
      user: user,
    });
  });
});

siteController.get('/new', (req, res) => {
  res.render('new');
});

siteController.post('/new', (req, res) => {
  const {name,familyName,password,role} = req.body;
  const user = new User({name,familyName,password,role});
  user.save( err => {
    if (err) { return next(err) }
    res.redirect('/private');
  })
});

siteController.get("/:id/edit",(req,res,next) => {
  const userId = req.params.id;
  User.findById(userId).exec().then( user => {
    console.log({user})
    res.render("edit", {user});
  }).catch(e => next(e))
});

siteController.post("/:id/edit",(req,res,next) => {
  const userId = req.params.id;
  console.log(userId);
  const currentUser = req.session.currentUser;

  const {name,familyName,password} = req.body;
  const updates = {name,familyName,password};
  
  if (req.body.name != ""){
    updates.name = req.body.name;
  }

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    res.redirect('/public');
  });
});

module.exports = siteController;
