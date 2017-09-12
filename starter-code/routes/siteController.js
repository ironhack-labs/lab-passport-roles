const express = require("express");
const siteController = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 12;
const passport = require("passport");
const localStrategy = require("passport-local").Strategy
const Employee = require("../models/employee");
const session = require("express-session")

function ensureAuthenticated(req, res, next) {
  if (passport.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

function checkRoles(role) {
  console.log(req.user);
  return function(req, res, next) {
    if ( req.user.role === role) {
      console.log("ROLES", req.user.role);
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkDeveloper = checkRoles('Developer');
const checkBoss  = checkRoles('Boss');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("auth/login");
})

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/home", checkBoss(), (req, res, next) =>{
  res.render("account",{user: username},{})
})

siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
})

siteController.post("/signup", (req, res, next)=>{
  const id = req.body._id;
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;

  if (username == "" || password == ""){
    res.render("auth/signup", { message: "Indicate a username and password, please"});
    return;
  }

  Employee.findOne({ username }, "username", (err, user)=>{
    if (user !== null){
      res.render("auth/signup", {message: "Username already exists"});
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newEmployee = new Employee({
      username,
      name,
      familyName,
      password: hashPass,
    })
    .save()
    .then(user => res.redirect('/'))
    .catch(e => res.render("signup"),{message: "Something went wrong. Try again"});
  })
})

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = siteController;
