const express = require("express");
const siteController = express.Router();
const session = require("express-session");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user")

// EnsureLogin for private page.
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/private-page", (req, res) => {
  res.render("auth/private", { user: req.user });
});

siteController.get('/auth/newUser', (req, res) => {
  if(req.user && req.user.role == "Boss") res.render('auth/newUser');
  res.redirect('/')
});

siteController.post('/auth/newUser', (req, res, user) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username == "" || password == "" || role == ""){
    res.render("auth/newUser", {
      errorMessage: "Indicate username, password and role"
    });
    return;
  }

  User.findOne({ "username": username}, (error, user) => {
    if (user !== null) {
      res.render("auth/newUser", {
        errorMessage: "Username already exist"
      });
      return;
    }
  });

  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User({
    username,
    name,
    familyName,
    password: hashPass,
    role
  });

  newUser.save()
  .then(() => {
    console.log('New User Created!');
    res.redirect('/private-page');
  })
  .catch(() => {
    res.render("auth/newUser", {
      errorMessage: "Couldn't create a new user"
    });
  });
});

siteController.get("/auth/team", (req, res, next) => {
  User.find({})
  .then(users => {
    res.render("auth/team", {users: users});
  })
  .catch(e => {
    res.redirect("/");
  });
});


siteController.get('/auth/:id/delete', (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(users => { res.redirect("/auth/team");
    })
    .catch(e => {
      res.redirect("/");
    });
  });

// USER EDIT
siteController.get('auth/:id/edit', (req, res) => {
  User.findById({_id: req.params.id}, (error, user) => {
    res.render('auth/edit', {user : user});
  })
});

siteController.post('auth/:id/edit', (req, res) => {
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(req.body.password, salt);

  var updateObj = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    password: hashPass,
  };

  User.findByIdAndUpdate(req.params.id, updateObj, (error, user) => {
    res.redirect('/private-page');
  })
});



var checkBoss  = checkRoles('Boss');
var checkTA = checkRoles('TA');
var checkDeveloper  = checkRoles('Developer');

function checkRoles(role) {
  return function(req, res, next) {
    console.log(req.user)
    if (req.isAuthenticated() && req.user.roles === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

siteController.get('/private', checkBoss, (req, res) => {
  res.render('auth/private', {user: req.user});
});

module.exports = siteController;
