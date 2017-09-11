const express = require("express");
const siteController = express.Router();
const check = require("../middlewares/check")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const passport = require('passport');
const bcryptSalt = 10

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.post("/", passport.authenticate("local", {
  successRedirect: "/personal",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/personal", check.ensureAuthenticated(), (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) { return next(err) }
    const userSession = req.user
    res.render("user/personal", { users: users, userSession: req.user })
  })
})

siteController.get("/personal/:id", check.ensureAuthenticated(), (req, res, next) => {
  const userId = req.params.id
  User.findById(userId, (err, user) => {
    if(err) { return next(err) }
    res.render("user/profile", { 
      title: "Profile", 
      user:user,
      userSession: req.user
    })
  })
})

siteController.get("/adduser", check.checkRoles("Boss"), (req, res, next) => {
  res.render("user/add")
})

siteController.post("/adduser", check.checkRoles("Boss"), (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const name = req.body.name
  const familyname = req.body.familyname
  const role = req.body.role

  if (username === "" || password === "" || role === "") {
    res.render("user/add", {
      title: "New User",
      errorMessage: "Indicate a username and a password to sign up"
    })
    return
  }

  User.findOne({ "username": username }).then(user =>{
    console.log("holi")
    if(user){
      res.render("user/add", {
        title: "New User",
        errorMessage: "User already exists"
      })
      return
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    new User({
        username : username,
        password : hashPass,
        name: name,
        familyName: familyname,
        role: role
      })
      .save()
      .then(() => res.redirect('/personal'))
      .catch(e => next(e))
  })
})

siteController.get("/edit/:id", check.ensureAuthenticated(), (req, res, next) => {
  const userId = req.params.id
  User.findById(userId, (err, user) => {
    if (err) { return next(err) }
    res.render('user/edit', { title:'Edit profile', user:user, userSession: req.user })
  })
})

siteController.post("/edit/:id", check.ensureAuthenticated(), (req, res, next) => {
  const userId = req.params.id
  const updates = {
    username : req.body.username,
    name : req.body.name,
    familyName : req.body.familyname,
    role : req.body.role
  }

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err) { return next(err) }
    res.redirect('/personal')
  })
})

siteController.get("/delete/:id", check.checkRoles("Boss"), (req, res, next) => {
  const userId = req.params.id
  User.findByIdAndRemove(userId, (err, user) => {
    if(err) { return next(err) }
    res.redirect("/personal")
  })
})

siteController.post('/logout',(req,res) =>{
  req.logout();
  res.redirect("/");
});

module.exports = siteController;
