const express = require("express");
const siteController = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

const ensureLogin = require("connect-ensure-login");

const passport = require("passport");

//check roles
const checkGuest  = checkRoles('DEVELOPER');
const checkEditor = checkRoles('TA');
const checkAdmin  = checkRoles('BOSS');




// //role security
siteController.get("/private", checkRoles("BOSS"), (req, res)=>{
  res.render("private", {user:req.user});
});


// //private routes
// //private page
siteController.get("/private",
  ensureLogin.ensureLoggedIn(),
  (req, res)=>{

      console.log(req.user);
      res.render("private", {user:req.user});

  });

siteController.get("/private", ensureAuthenticated, (req,res)=>{
 res.render("private", {user:req.user});
});

//middleware for ensure login
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}
// //middleware for ensure role
function checkRoles(role){
  return function(req, res,next){
      if(req.isAuthenticated() && req.user.role === role){
          return next();
      }else{
          res.redirect("/");
      }
  }
}





//google facebook

//google facebook



//google login

//google login


// ******LOGIN USUARIOS

siteController.get("/login", (req,res)=>{
  res.render("auth/login",{ "message": req.flash("error") });
})
.post("/login", passport.authenticate("local", {
   successRedirect: "/",
   failureRedirect: "/login",
   failureFlash: true,
   passReqToCallback: true
}));


//logout
siteController.get("/logout", (req,res)=>{
  req.logout();
  res.redirect("/login");
});

// ******CREAR USUARIOS

siteController.get("/signup", (req,res, next)=>{
  res.render("auth/signup");
})

.post("/signup", (req,res,next)=>{
  const username = req.body.username,
        password = req.body.password;
  if(username === "" || password === ""){
      res.render("auth/signup", {message: "Indicate username and password"});
      return;
  }

  User.findOne({username}, "username", (err, user)=>{
     if (user !== null){
         res.render("auth/signup", {message:"The username already exists"});
         return;
     }

     const hashPass = bcrypt.hashSync(password, salt);

     const newUser = new User({
        username,
        password:hashPass
     });

     newUser.save(err=>{
         if (err) return res.render("auth/signup", { message: "Something went wrong" });
          res.redirect("/");
     });

  });
});


siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/users", (req,res, next)=>{
  res.render("auth/users");
})
module.exports = siteController;
