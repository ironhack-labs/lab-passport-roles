const express = require("express");
const router = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");


router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

/*router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});*/

/*router.get('/private', ensureAuthenticated, (req, res) => {
  res.render('passport/private', {user: req.user});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}*/

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

var checkBoss  = checkRoles('Boss');
var checkDeveloper = checkRoles('Developer');
var checkTA  = checkRoles('TA');

router.get('/private', checkBoss, (req, res) => {
  //res.render('passport/private', {user: req.user});
  User.find().exec((err, users) => {
    res.render('passport/private', {
      user: req.user,
      users: users
    });
  });

});

/* CRUD -> CREATE FORM */
router.get('/private/new', (req, res) => {
  res.render('users/new');
});

/*CRUD -> CREATE DATABASE */
router.post('/private/new', (req, res) => {
  console.log("dentro del post new");
  console.log(req.body);
  const {username,name,familyName,password,role} = req.body;
  const user = new User({username,name,familyName,password,role});
  console.log("antes de crear el usuario");
  user.save( err => {
    if (err) { return next(err) }
    console.log("antes de redireccionar");
    res.redirect('/private');
  })
});

/*CRUD -> DELETE DATABASE */
router.get('/private/delete/:id', (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, (err, product) => {
    if (err){ return next(err); }
    return res.redirect('/private');
  });
});

/*
router.get('/posts', checkEditor, (req, res) => {
  res.render('private', {user: req.user});
});
*/


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;