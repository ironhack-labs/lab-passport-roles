
const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");


userRoutes.get('/users/:userId/profile', (req, res, next) => {
  User.findById(req.params.userId).then(user => {
    res.render('users/profile',{user})
  }).catch((error)=> {
    console.log(`Can't show user profile`)
    res.render('/users');
  });
});

userRoutes.get('/users/add', (req, res, next) => {
  res.render('users/add');
});

userRoutes.post('/users/add', (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  const user = {
    username: req.body.username,
    role: req.body.role,
    password: hashPass
  };
  if (user.username === "" || user.role === "None" || user.password === "") {
    req.flash('error', "Indicate username, role and password");
    res.redirect("/users/add");
    return;
  }
  User.create(user).then(user => {
    console.log(`Created user: ${user._id} ${user.username} with ${user.role} role"`);
    res.redirect('/users');
  })
  .catch((error)=> {
    console.log(error);
    res.render('users/add');
  });
});

userRoutes.get('/users/:userId/delete', (req,res) => {
  User.findByIdAndDelete(req.params.userId).then(()=> {
    res.redirect('/users');
  })
  .catch((error)=> {
    console.log(`Can't delete user`)
    res.redirect('/users');
  });
});

userRoutes.get('/users/:userId/edit', (req,res) => {
  User.findById(req.params.userId).then(user => {
    res.render('users/edit', {user})
  }).catch((error)=> {
    console.log(error);
    res.render(`users/${req.params.userId}/profile`);
  });
});


userRoutes.post('/users/:userId/edit', (req,res) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  const user = {
    username: req.body.username,
    role: req.body.role,
    password: hashPass
  };
  const userId = req.params.userId;
  User.findByIdAndUpdate(userId, user).then(() => {
    res.redirect(`/users/${userId}/profile`);
    //res.redirect('/users');
  });
});

module.exports = userRoutes;
