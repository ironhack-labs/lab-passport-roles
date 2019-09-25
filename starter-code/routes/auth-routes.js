// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");

// User model
const User = require("../models/user");
const Category = require("../models/Category");
const Blog = require("../models/Blog");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/notallowed')
    }
  }
}

function checkRolesTADEVEDIT() {
  return function(req, res, next) {
    console.log("debug:"+req.user.username+ " params:"+req.params.username);
    if (req.isAuthenticated() && (req.user.role ==='Developer' || req.user.role==='TA') && req.user.username===req.params.username) {
      return next();
    } else {
      res.redirect('/notallowed')
    }
  }
}

function checkRolesTADEV() {
  return function(req, res, next) {
    if (req.isAuthenticated() && (req.user.role ==='Developer' || req.user.role==='TA') ) {
      return next();
    } else {
      res.redirect('/notallowed')
    }
  }
}


const checkAdmin  = checkRoles('Admin');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');
const checkTADEV = checkRolesTADEV();
const checkTADEVEDIT = checkRolesTADEVEDIT();

authRoutes.get("/notallowed", (req, res, next) => {
  res.render("notallowed", { "message": req.flash("error") });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

/* also work here ensureAuthenticated  or ensureLogin.ensureLoggedIn()*/
authRoutes.get("/dashboard",  checkAdmin,  (req, res, next) => {
   

  Blog.find()
  .then(blogs => { 

    let pair=[]; 
    let newCat=[];
    let cnt=0;
    for (let i=0;i<blogs.length;i++){
        pair.push(blogs[i]);
        if (i%2!=0)
            {
              newCat.push(pair);
              pair=[];
            }

    }
    if (blogs.length%2!=0)
     newCat.push(pair);

   Category.find()
   .then(categories => {
    res.render("auth/dashboard", {loggedUser:req.user,categories:categories,blogs:newCat});
   })
   .catch(error => {
    console.log('Error while getting the categories from the DB: ', error);
   })

  })
  .catch(error => {
    console.log('Error while getting the blogs from the DB: ', error);
   }) 


 
});

authRoutes.get("/editProfile/:username",  checkTADEVEDIT, (req, res, next) => {
  
  res.render("auth/seeProfile", { user: req.user,profileuser:req.params.username });
});

authRoutes.get("/seeProfile/:username",  checkTADEV, (req, res, next) => {
  
  res.render("auth/seeProfile", { user: req.user,profileuser:req.params.username });
});

authRoutes.get("/createUSer",  checkAdmin,  (req, res, next) => {
  res.render("auth/signup", { user: req.user });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

authRoutes.get("/myaccount", ensureLogin.ensureLoggedIn(), (req, res) => {
 
  res.render("auth/myaccount", { user: req.user });
});

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "") {
    res.render("auth/signup", { message: "Indicate username , password and role" });
    return;
  }


  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hashPass,
    role
  });

  newUser.save((err) => {
    if (err) {
      res.render("/dashboard", { message: "Something went wrong" });
    } else {
      res.redirect("/dashboard");;
    }
  });








});



  


module.exports = authRoutes;