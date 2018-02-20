const express         = require("express");
const siteController  = express.Router();
const User            = require("../models/User");
const bcrypt          = require("bcrypt");
const salt            = bcrypt.genSaltSync(10);
const passport        = require("passport");
const ensureLogin     = require("connect-ensure-login");

const checkBoss       = checkRoles('Boss');
const checkManager    = checkRoles('General Manager');
const checkDeveloper  = checkRoles('Developer');
const checkTA         = checkRoles('TA');




siteController.get("/employees/new", checkBoss, (req, res, next) =>{
  res.render("employees/new_form", {user: req.user});
})

.post("/employees/new", ensureAuthenticated, (req, res, next) =>{
  const username = req.body.username,
        password = req.body.password;
        role  = req.body.role;
    if(username === "" || password === ""){
        res.render("auth/signup", {message: "Indicate username and password"});
        return;
    }

    User.findOne({username}, "username", (err, user)=>{
       if (user !== null){
           res.render("employees/new_form", {message:"The username already exists"});
           return;
       }
       const hashPass = bcrypt.hashSync(password, salt);
       const newUser = new User({
          username,
          password:hashPass,
          role,
       });
       newUser.save(err=>{
           if (err) return res.render("employees/new_form", { message: "Something went wrong" });
            res.redirect("/login");
       });

    });
});


siteController.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', {user: req.user});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}
function checkRoles(role){
  return function(req, res,next){
      if(req.isAuthenticated() && req.user.role === role){
          return next();
      }else{
          res.redirect("/login");
      }
  }
}

siteController.get("/login", (req,res)=>{
  res.render("auth/login", {"message":req.flash("error")});
});

siteController.post("/login", passport.authenticate("local", {
   successRedirect: "/account",
   failureRedirect: "/login",
   failureFlash: true,
   passReqToCallback: true
}));

siteController.get('/signup', (req, res, next) =>{
  res.render('auth/signup');
});

siteController.post('/signup', (req, res, next) =>{
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
          res.redirect("/login");
       });

    });
});

siteController.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = siteController;

