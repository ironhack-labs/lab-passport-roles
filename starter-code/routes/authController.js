const express = require("express");
const authController = express.Router();
// Passport require.
const passport = require("passport");
const User = require('../models/User')
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// FACEBOOK AUTH
authController.get("/facebook", passport.authenticate("facebook"));
authController.get("/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-profile",
  failureRedirect: "/"
}));

// LOGIN
authController.get('/login', (req, res) => {
  res.render('auth/login');
});

authController.post('/login', passport.authenticate('local' , {
  successRedirect: '/private-profile',
  failureRedirect: '/auth/login',
}));

// NEWUSER CREATION
authController.get('/newUser', (req, res) => {
  if(req.user && req.user.role == "Boss") res.render('auth/newUser');
  res.redirect('/')
});

authController.post('/newUser', (req, res, user) => {
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

  newUser.save(error => {
    if (error) {
      res.render("auth/newUser", {
        errorMessage: "Couldn't create a new user"
      });
    } else {
      console.log('New User Created!');
      res.redirect('/private-profile');
    }
  });
});

// USER DELETE
authController.get('/:id/delete', (req, res) => {
  User.findByIdAndRemove({_id: req.params.id}, (error) => {
    res.redirect('/team');
  })
});

// USER EDIT
authController.get('/:id/edit', (req, res) => {
  User.findById({_id: req.params.id}, (error, user) => {
    res.render('auth/edit', {user : user});
  })
});

authController.post('/:id/edit', (req, res) => {
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(req.body.password, salt);

  var updateObj = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    password: hashPass,
  };

  User.findByIdAndUpdate(req.params.id, updateObj, (error, user) => {
    res.redirect('/private-profile');
  })
});

// LOGOUT

authController.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = authController;
