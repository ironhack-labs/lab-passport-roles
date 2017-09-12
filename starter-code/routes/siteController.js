const express = require("express");
const siteController = express.Router();


// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkBoss = checkRoles("BOSS")
const checkTa = checkRoles("TA")
const checkDeveloper = checkRoles("DEVELOPER")

siteController.get("/", (req, res, next) => {
  res.render("index");
});


//ensureLogin.ensureLoggedIn()

siteController.get("/private-page", checkRoles("BOSS"), (req, res, next) => {
  User.find()
    .then(result => res.render('passport/private', {
      users: result
    }, {
      user: req.user
    }))
    .reject(err => console.log(err));
});


// sign up get
siteController.get("/signup", (req, res, next) => {
  res.render("passport/signup.ejs");
})
// sign up post
siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    console.log("User created");

    const newUser = new User({
        username,
        password: hashPass
      })
      .save()
      .then(user => res.redirect('/'))
      .catch(e => res.render("auth/signup", {
        message: "Something went wrong"
      }));

  });
});

// login get

siteController.get("/login", (req, res, next) => {
  res.render("passport/login.ejs");
})

// login post

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

//change roles get
siteController.get('/changeRoles/:id', (req, res, next) => {
  if (req.user._id == "59b6b7a1a2d3773c26a7e050") {
    res.render('passport/changeRoles.ejs', {
        theBoss: req.user
      }
    )};

});

//change roles get

siteController.post('/changeRoles/:id', (req, res, next) => {
  const update = {
    username: req.body.username,
    password : req.body.password,
    role:req.body.role
  };
  bossId = req.user._id;




 User.findByIdAndUpdate(bossId, update)
    .then(result => res.redirect('/'))
    .catch(err => console.log ("Error"));
});

siteController.post('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = siteController;
