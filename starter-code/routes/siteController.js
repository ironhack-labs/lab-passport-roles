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
  res.render("index", {
    user: req.user
  });
});

// Profiles

siteController.get('/profile', (req, res) => {
  res.redirect('/profile/' + req.user.id)
});

siteController.get("/profile/:id", ensureAuthenticated(), (req, res, next) => {
  User.findById(req.params.id).then(response => {
    User.find({}, (err, users) => {
      if (err) {
        return next(err)
      }
      res.render("profile/show", {
        user: response,
        users: users,
        userSession: req.user
      })
    })
  }).catch(err => next(err))
})

siteController.get("/profile/:id/edit", ensureAuthenticated(), (req, res, next) => {
  res.render("profile/edit", {
    user: req.user
  });
})

siteController.get("/profile/:id/edit", ensureAuthenticated(), (req, res, next) => {
  let id = req.params.id;

  const updateUser = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    role: req.body.role
  };

  User.findByIdAndUpdate(id, updateUser, (err, user) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/');
  });
})

// Allow only the Boss user to add and remove employees to the platform.

siteController.get("/employees/add", checkBoss, (req, res, next) => {
  res.render('employees/add', {
    users: req.user
  })
});

siteController.post("/employees", checkBoss, (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || name === "" || familyName === "" || password === "" || role === "") {
    res.render("employees/add", {
      message: "Please make sure to fill all fields"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("employees/add", {
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
      })
      .save()
      .then(user => res.redirect('/'))
      .catch(e => res.render("employees/add", {
        message: "Something went wrong"
      }));
  });
});

siteController.get('/profile/:id/delete', checkBoss, (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(response => {
      return res.redirect('/profile');
    }).catch(err => {
      next(err)
    })
});

module.exports = siteController;
