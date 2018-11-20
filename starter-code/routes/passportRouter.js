const express = require("express");
const mongoose = require('mongoose');
const passportRouter = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
passportRouter.use(bodyParser.urlencoded({ extended: true }));


const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const flash = require('connect-flash');

const ensureLogin = require("connect-ensure-login");


function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && role.includes(req.user.role)) {
      return next();
    } else {
      res.render('permissionDenied', req.user)
    }
  }
}



passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login', { message: req.flash("error") });
});

passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log(req.user);
  res.render('passport/private', { user: req.user });
});

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

passportRouter.get('/manage-users', ensureLogin.ensureLoggedIn(), checkRoles(['Boss']), (req, res, next) => { //CHECK ROLES!!
  User.find()
    .then((users) => {
      res.render('manageUsers/userList', { users });
    })
    .catch((err) => {
      next(err);
    })
})

passportRouter.post('/delete-user/:id', ensureLogin.ensureLoggedIn(), checkRoles(['Boss']), (req, res, next) => { //CHECK ROLE!!
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/manage-users');
    })
    .catch((err) => {
      next(err);
    })

})

passportRouter.post("/create-user", checkRoles(['Boss']), (req, res, next) => {

  let { username, password, role } = req.body;

  let newUser = new User();
  newUser.username = username;
  newUser.role = role;

  if (username === "" || password === "") {
    res.redirect("/");
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  
  newUser.password = hashPass


  newUser.save()
    .then(() => {
      res.redirect('/manage-users');
    })
    .catch((err) => {
      res.render('manageUsers/createError', { message: err });
    })

});

passportRouter.get('/edit-user/:id', ensureLogin.ensureLoggedIn(), checkRoles(['Boss']), (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      res.render('manageUsers/userEdit', user);
    })
    .catch((err) => {
      next(err);
    })
})

passportRouter.post('/edit-user/:id', ensureLogin.ensureLoggedIn(), checkRoles(['Boss']), (req, res, next) => {

  let { username, role } = req.body
  User.findByIdAndUpdate(req.params.id, { username, role })
    .then(() => {
      res.redirect('/manage-users');
    })
    .catch((err) => {
      next(err);
    })
})


module.exports = passportRouter;