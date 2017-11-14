const express        = require("express");
const siteController         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

siteController.get('/', function(req, res, next) {
    res.render("passport/signup");

});

siteController.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

siteController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var role = req.body.role;


  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass,
      role,

    });

    console.log(newUser);

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.redirect("/login");
      }
    });
  });
});

siteController.get("/login", (req, res, next) => {
  res.render("passport/login");
});


siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "passport/login",
  failureFlash: true,
  passReqToCallback: true
}));

//Meter en un middleware similar al isLoggedIn

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

var checkBoss  = checkRoles('BOSS');
var checkTa  = checkRoles('TA');
var checkDeveloper  = checkRoles('DEVELOPER');

// siteController.get('/login', checkTa, (req, res) => {
//   res.render('passport/show', {user: req.user});
// });

siteController.get("/private-page", (req, res, next) => {

  User.find((err, detail) => {
    res.render("passport/employee", {
      Users: detail,
    });
  });
});

siteController.post('/private-page', (req, res, next) => {

  const employeeInfo = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    role: req.body.role,
  };

  // Create a new User with the params
  const newUser = new User(employeeInfo);

  newUser.save((err) => {
    if (err) {
      return res.render('/passport/private', {
        user: newUser
      });
    }
    return res.redirect('/private-page/employee');
  });
});

siteController.post('/:user_id', (req, res, next) =>{
  console.log(req.params.user_id);

  User.remove({ _id: req.params.user_id },(err, response) =>{
      if (!err) {
        res.redirect('/private-page');
      } else {
        console.log(err);
        message.type = 'error';
      }
  });
});


module.exports = siteController;
