const express = require('express');
const mongoose = require('mongoose');
const authRoutes = express.Router();
const passport = require("passport");
const bcrypt = require('bcrypt');
const ensureLogin = require("connect-ensure-login");

const User = require('../models/user');

const bcryptSalt = 10;

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

authRoutes.get('/signup', (req, res, next)=>{
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next)=>{
  const username = req.body.username;
  const password = req.body.password;

  //Validation
  if(username === '' || password === ''){
    res.render('auth/signup', {
      errorMessage : 'All fields are required'
    });
    return;
  }

  //Check if user exists
  User.findOne({'username' : username}, 'username', (err, user)=>{
    if(user !== null){
      res.render('auth/signup', {
        errorMessage : 'This user already exists'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass
    });

    newUser.save((err)=>{
      if(err){
        res.render('auth/signup', {
          errorMessage : 'Something went wrong trying to create the user'
        });
      } else {
        res.redirect('/');
      }
    });
  });
});

module.exports = authRoutes;

