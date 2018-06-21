const express = require('express');
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const passportRouter = express.Router();
// User model
const User = require("../models/User");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// // Home
passportRouter.get("/", (req, res, next) => {
  res.render("home");
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTA  = checkRoles('TA');

//* GET method to show the signup form
passportRouter.get("/signup", checkRoles('BOSS'), (req, res, next) => {
  res.render("auth/signup");
});

//* POST method to retrieve the information from the form 
passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        username,
        password: hashPass
      });
      newUser.save()
        .then(user => {
          res.redirect("/");
        })
        .catch(err => {
          res.render("auth/signup", {
            errorMessage: "Something went wrong"
          });
        });
    });
});



// LOGIN
passportRouter.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get('/private', checkBoss, (req, res) => {
  res.render('private', {user: req.user});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

passportRouter.get('/private', checkDeveloper, (req, res) => {
  res.render('private', {user: req.user});
});

passportRouter.get('/posts', checkTA, (req, res) => {
  res.render('private', {user: req.user});
});

  // LOGOUT
  passportRouter.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/logout");
  });


module.exports = passportRouter;