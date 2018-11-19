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

passportRouter.get('/manage-users', ensureLogin.ensureLoggedIn(), (req, res, next) => { //CHECK ROLES!!
  User.find()
    .then((users) => {
      res.render('manageUsers/userList', { users });
    })
    .catch((err) => {
      next(err);
    })
})

passportRouter.post('/delete-user/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => { //CHECK ROLE!!
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/manage-users');
    })
    .catch((err) => {
      next(err);
    })

})

passportRouter.post("/create-user", (req, res, next) => {

  let { username, password, role } = req.body;

  let newUser = new User();
  newUser.username = username;
  newUser.password = password;
  newUser.role = role;

  if (username === "" || password === "") {
		res.redirect("/");
		return;
}

  newUser.save()
  .then(()=>{
    console.log('User successfully created.')
    res.redirect('/manage-users');
  })
  .catch((err)=>{
    console.log('Error creating user: ' + err)
    res.redirect('/')
  })

});

module.exports = passportRouter;