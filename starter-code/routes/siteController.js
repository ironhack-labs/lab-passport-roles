const express = require("express");
const siteController = express.Router();
// User model
const User = require("../models/user");
const Course = require("../models/course");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

siteController.get("/", (req, res, next) => {
  res.render("index");
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

var checkTA  = checkRoles('TA');
var checkDeveloper = checkRoles('Developer');
var checkBoss  = checkRoles('Boss');

siteController.get('/private', checkBoss, (req, res) => {
  res.render('private', {user: req.user});
});


//LOGIN
siteController.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


siteController.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

siteController.get("/edit-profile/:id", ensureLogin.ensureLoggedIn(), (req, res) => {
  let userId = req.params.id;
  User.findById(userId, (err, users) => {
    if (err) {
      next(err);
    } else {
      res.render("passport/edit", { users: req.user });
    }
  });

});


//WHEN I GO TO THE EDIT PAGE, GET ALL USERS.  DISPLAY WITH FOREACH ON THE 'SIGNUP' PAGE
siteController.get('/edit', (req, res, next) =>{
  User.find({}, (err, users) => {
    if (err) {
      next(err);
    }
    else {
        res.render("passport/signup", { users });
      }
  });
});

//Creating a New User
siteController.post('/edit', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;
  let familyName = req.body.familyName;
  let role = req.body.role;
  let userId = req.params.id;

  if (username === "" || password === "" || name === "" || familyName === "") {
    res.render("passport/signup", {
      errorMessage: "Please provide your name, email, and new password to sign up..."
    });
    return;
  }else{
    User.findOne({ username: username}, (err, user) => {
      if(err){
        next(err);
      } else {
        if(!user) {
          // no user
          var salt     = bcrypt.genSaltSync(bcryptSalt);
          var hashPass = bcrypt.hashSync(password, salt);


          //STORING THE USER INFORMATION IN THE DATABASE WITH APPROPRIATE VARIABLES
          var newUser  = User({
            username,
            name,
            familyName,
            role,
            userId,
            password: hashPass
          });
          console.log(newUser);
          newUser.save((err) => {
            if (err) {
              next(err);
            } else {
              res.redirect("/");
            }
          });
        }else {
            res.render("passport/signup", {
            errorMessage: "Username taken!"
          });
        }
      }
    });
  }
});

// GET USER IDS


// siteController.get("/:id", (req, res, next) => {
//   let userId = req.params.id;
//   User.findById(userId, (err, users) =>{
//     if (err) {
//       next(err);
//     } else {
//       res.render("passport/signup", {users: user});
//     }
//   });
// });



// router.get('/posts', checkEditor, (req, res) => {
//   res.render('private', {user: req.user});
// });


module.exports = siteController;
