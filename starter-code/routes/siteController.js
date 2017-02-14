const express = require("express");
const siteController = express.Router();
// User model
const User           = require("../models/user");
// Course model
const Course         = require('../models/course');
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

//CheckRoles function
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

//Role constants
const checkTA  = checkRoles('TA');
const checkDeveloper = checkRoles('Developer');
const checkBoss  = checkRoles('Boss');

//Boss Page render
siteController.get("/iIztheBoss", checkBoss, (req, res) => {
  res.render("auth/bosspage", { user: req.user });
});

//Developer Page render
siteController.get("/dev/:id", checkDeveloper, (req, res) => {
  res.render("auth/dev", { user: req.user });
});

//Boss Feature-Add Employee
siteController.get('/new', checkBoss, (req, res, next) => {
  res.render('auth/new', { user: req.user });
});

siteController.post('/iIztheBoss', (req, res, next) => {
  const employeeInfo = {
      username   : req.body.username,
      name       : req.body.name,
      familyName : req.body.familyName,
      password   : req.body.password,
      role       : req.body.role
  };

  const newEmployee = new User(employeeInfo);

  newEmployee.save( (err) => {
    if (err) { return next(err) }
    // redirect to the bosspage
    return res.redirect('/iIztheBoss');
  });
});

//Boss Features-Delete Employee
siteController.get('/delete', checkBoss, (req, res, next) => {
  User.find({}, (err, employees) => {
    if (err) { return next(err) }

    res.render('auth/delete', { employees });

  });
});

siteController.post('/delete/:id/delete', (req, res, next) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, (err, exmployee) => {
    if (err){ return next(err); }
    return res.redirect('/iIztheBoss');
  });
});

//Loging In
siteController.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

// siteController.post("/login", (err, user) => {
//     User.find({}, (err, user) => {
//       console.log(user.length);
//      for (var i=0; i < user.length; i++){
//        console.log(user[i].role);
//        if (err){
//          return next(err);
//     } else if (user[i].role === "Boss"){
//       console.log(user[i].role);
//          passport.authenticate("local",{
//          successRedirect: "/iIztheBoss",
//          failureRedirect: "/login",
//          failureFlash: true,
//          passReqToCallback: true});
//      } else if (user[i].role === "Developer"){
//        return user = passport.authenticate("local",{
//          successRedirect: "/dev",
//          failureRedirect: "/login",
//          failureFlash: true,
//          passReqToCallback: true});
//      } else if (user[i].role === "TA"){
//        return user = passport.authenticate("local",{
//          successRedirect: "/ta",
//          failureRedirect: "/login",
//          failureFlash: true,
//          passReqToCallback: true});
//      } return console.log("lol");
//      }
//    });
// });

siteController.post("/login", passport.authenticate("local", {
    successRedirect: "/iIztheBoss",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

//Login Out
siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = siteController;
