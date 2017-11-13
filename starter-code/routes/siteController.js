const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require('passport');
const express = require("express");
const siteController = express.Router();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const checkRoles = require("../middlewares/checkRoles");

const checkBoss = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

// Login

siteController.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("Error logging in") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// Profiles

siteController.get('/profile',(req,res) =>{
  res.redirect('/profile/' + req.user.id)
});

siteController.get("/profile/:id", ensureAuthenticated(), (req, res, next) => {
  User.findById(req.params.id).then(response => {
    User.find({}, (err, users) => {
      if (err) { return next(err) }
      res.render("profile/show", { user:response, users: users, userSession: req.user })
    })
  }).catch( err => next(err))
})

// Allow only the Boss user to add and remove employees to the platform.

siteController.get("/add", checkBoss, (req, res, next) => {
  User.find({}).then( response => {
    res.render('auth/signup', { users: response })
  }).catch( err => { next(err) } )
});

siteController.post("/add", checkBoss, (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || name === "" || familyName === "" || password === "" || role === "") {
    res.render("auth/signup", { message: "Please make sure to fill all fields" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
          username,
          name,
          familyName,
          password: hashPass,
          role
        })
        .save()
        .then(user => res.redirect('/profile')).catch(e => res.render("auth/signup", { message: "Something went wrong" }));
      });
    });

  siteController.get('/profile/:id/delete', checkBoss, (req, res, next) => {
    User.findByIdAndRemove(req.params.id).then(response => {
      return res.redirect('/profile');
    }).catch( err => { next(err) })
  });

// Log out

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// Facebook

siteController.get("/auth/facebook", passport.authenticate("facebook"));
siteController.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/profile",
  failureRedirect: "/"
}));

module.exports = siteController;
