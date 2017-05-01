/*jshint esversion: 6*/

const express = require("express");
const siteController = express.Router();

const User = require('../models/user');

const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


siteController.get("/", (req, res, next) => {
  res.render("index");
});


siteController.get('/signup', (req, res, next) => {
  res.render('users/signup');
});


siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const name =    req.body.name;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || name === "" || password === "" || role === "") {
    res.render("users/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("users/signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      name: name,
      password: hashPass,
      role: role
    });
    newUser.save((err) => {
      if (err) {
        res.render("users/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});


siteController.get('/login', (req, res, next) => {
  res.render('users/login');
});


siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


siteController.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect("/login");
});


function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

siteController.get('/management', checkRoles('Boss'), (req, res) => {
  res.render('management', {user: req.user});
});

/*GET ALL USERS*/
siteController.get('/management/index', (req, res, next) => {
  User.find({}, (err, users) => {
    if(err){return next(err);}
    res.render('management/index', {
      users: users
    });
  });
});

/*GET ADD NEW USER*/
siteController.get('/management/add', (req, res) => {
  res.render('management/add');
});

/*POST ADD NEW USER*/
siteController.post('/management/add', (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const role = req.body.role;

  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username: username,
    name: name,
    password: hashPass,
    role: role
  });

  newUser.save((err) => {
    if(err) {res.redirect('/management/add');}
    return res.redirect('/management');
  });
});


/*POST DELETE A CELEB*/
siteController.post('/management/:id/delete', (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndRemove(userId, (err, user) => {
    if(err) {return next(err);}
    res.redirect('/management/index');
  });
});

module.exports = siteController;
