const express = require("express");
const siteController = express.Router();
const passport = require('passport');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const checkRoles = require('../middlewares/checkRole');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//get index
siteController.get("/", (req, res, next) => {
  res.render("index");
});

//post index login
siteController.post("/", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/"
}));

//get /boss if role === boss
/* siteController.get('/boss', checkRoles('Boss'), (req, res) => {
  res.render('boss',users:users);
}); */

siteController.get('/boss', checkRoles('Boss'), function(req, res, next) {
  User.find().exec((err, users) => {
      res.render('boss', {
          users: users
      });
  });
});

//post new user
siteController.post("/boss", (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("boss", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("boss", {
        message: "The username already exists"
      });
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
    });
    console.log(newUser);
    newUser.save((err) => {
      if (err) {
        res.render("boss", {
          message: "Something went wrong"
        });
      } else {
        res.redirect("/boss");
      }
    });
  });
});

siteController.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id, (err, user) => {
    if (err) {return next(err);}
    return res.redirect('/boss');
  });
});

//logout
siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = siteController;