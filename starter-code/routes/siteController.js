const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');
const debug = require('debug')("app:auth:local");
const siteController = require('express').Router();


siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get('/login', (req, res) => {
  res.render('auth/login', { message: req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/signup",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/signup", (req, res, next) => {
  User.find({})
    .then(response => {
      res.render('auth/signup', {
        title: 'Lista de productos',
        users: response
      });
    })
    .catch(err => { next(err) })
});

siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || name === "" || familyName === "" || password === "" || role === "") {
    res.render("auth/signup", { message: "Indicate all fields" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    debug("User created");

    const newUser = new User({
      username,
      name,
      familyName,
      password: hashPass,
      role
    })
      .save()
      .then(user => res.redirect('/signup'))
      .catch(e => res.render("auth/signup", { message: "Something went wrong" }));

  });
});

// DELETE USER
siteController.get('/:id/delete', (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndRemove(userId)
    .then(response => {
      return res.redirect('/signup');
    }).catch(err => { next(err) })
});

module.exports = siteController;