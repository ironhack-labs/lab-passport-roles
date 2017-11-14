const express = require("express");
const router = express.Router();
const passport =require('passport');
const ensureLogin = require("connect-ensure-login");
const User =require('../models/User');
const bcrypt = require("bcrypt");
const bcryptSalt =10;

function checkRoles(role) {
  return function(req, res, next) {
    console.log(req.user);
    console.log ("is auth:" +req.isAuthenticated());
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else if (req.isAuthenticated()){
      return next();
    }else{
      console.log("NO PUEDORRRRR");
      res.redirect('/');
    }
  };
}
// Go to login form
router.get("/",(req, res, next) => {
  res.render("auth/login");
});

// Go to add new employee form
router.get("/addNew",checkRoles('Boss'),(req,res,next)=>{
  res.render("auth/addNew");
});

// Add new Employee
router.post("/addNew",checkRoles('Boss'),(req,res,next)=>{
  let username = req.body.username;
  let password = req.body.password;
  let role=req.body.role;
  // can be removed and in the form add required in input tag HTML5
  if (username === "" || password === "") {
    res.render('auth/addNew', {
      errorMessage: " Please, indicate a username and a password"
    });
    return;
  }
  User.findOne({"username": username}, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/addNew", {errorMessage: "The username already exists"});
      return;
    }
    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username,
      password: hashPass,
      role
    });
    newUser.save((err) => {
      if (err) {
        res.render("auth/addNew", {
          errorMessage: "Something went wrong when signing up"});
      } else {
        res.redirect('/private/indexBoss');
    }
  });
  });
});

// Log in
router.post("/private", passport.authenticate("local", {
  successRedirect: "private-page",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), checkRoles('Boss'),(req, res) => {
    res.render("private/indexBoss", { user: req.user });
  });

module.exports = router;
