/*jshint esversion:6*/
const express = require("express");
const siteController = express.Router();
const passport      = require("passport");
const User =require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
siteController.get("/", (req, res, next) => {
  res.render("index");
});

///////////////////////////////////////////
siteController.get('/login', function(req, res, next) {
  res.render('login');
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/account",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

////////////////BOSS
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

const checkBoss  = checkRoles('Boss');
const checkTA = checkRoles('TA');
const checkDeveloper  = checkRoles('Developer');


siteController.get("/account",checkBoss, (req, res) => {
  User.find({},function (err,userList){
    if(err) return next(err);
    res.render('account',{ user: req.user, userList });
  });
});

siteController.get("/account",checkTA, (req, res) => {
  res.redirect('/login');
});

siteController.get("/account",checkDeveloper, (req, res) => {
  res.redirect('/login');
});

///////////////////////////////BOSS ACCOUNT
siteController.get("/account/new",checkBoss, (req, res) => {
    res.render('new',{ user: req.user});
});

siteController.post("/account",checkBoss, (req, res) => {
    const username= req.body.username;
    const password= req.body.password;
    const rol= req.body.rol;
    console.log(rol);
    if (username === "" || password === ""|| rol === "") {
        res.render("new", { message: "Indicate username and password" });
        return;
      }
      User.findOne({ username }, "username", (err, user) => {
        if (user !== null) {
          res.render("new", { message: "The username already exists" });
          return;
        }
        var salt     = bcrypt.genSaltSync(bcryptSalt);
        var hashPass = bcrypt.hashSync(password, salt);
        var newUser = User({
          username,
          password: hashPass,
          rol,
        });
        newUser.save((err) => {
          if (err) {
            res.render("new", { message: "The username already exists" });
          } else {
            res.render("new",{ message: "User "+username+" Added" });//"+username+"
          }
        });
      });
});
//////////////delete
siteController.post('/account/:id/delete', (req, res, next) => {
    const id = req.params.id;
    User.findByIdAndRemove(id,function (err) {
    if (err) return next(err);
    // res.redirect('/drones');
    res.render("new",{ message: "User Deleted!" });
  });
});
////////////logut
siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = siteController;
