/*jshint esversion: 6*/

const express        = require("express");
const siteController = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const flash          = require("connect-flash");


siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const role=req.body.role;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = User({
      username:username,
      password:hashPass,
      familyName:familyName,
      name:name,
      role:role
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        req.login(newUser, function(err) {//como o signup nao guarda os dados numa cookie, aqui dps de fazer signup faz me directamente um login com o new user que temos guardado
        if (err) {
        }
        return res.redirect('/private');
      });
      }
    });
  });
});

siteController.get("/login", (req, res, next) => {
  console.log("login");
  res.render("passport/login");
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});


siteController.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}


// var checkGuest  = checkRoles('BOSS');
// var checkEditor = checkRoles('DEVELOPPER');
// var checkAdmin  = checkRoles('TA');

function checkRoles(req, res, next) {
  console.log(req.isAuthenticated())
  if (req.isAuthenticated() && req.user.role === "BOSS") {
    return next();
  } else {
    res.redirect('/login')
  }
}

siteController.get('/private', checkRoles, (req, res) => {
  res.render('passport/private', {user: req.user});
});

siteController.get('/delete/:id/:name',(req,res,next)=>{
  User.remove({_id: req.params.id}, function(err,data){
  if(err) return err;
    res.redirect("passport/private")
  });
});

siteController.get("/profile-edit",(req,res,next)=>{
  res.render("profile-edit");
});

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = siteController;
