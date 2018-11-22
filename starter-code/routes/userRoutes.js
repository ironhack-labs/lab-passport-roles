
const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");


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
  const user = {
    username: req.body.username,
    role: req.body.role
  };
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


module.exports = userRoutes;
