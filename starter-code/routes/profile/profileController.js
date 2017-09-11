const express = require("express");
const profileController = express.Router();
const passport = require("passport");
const User = require("../../models/users");

profileController.get('/view', ensureAuthenticated, (req, res, next) =>{
  User.findById(req.user._id, (err, users) => {
    if (err) { return next(err) }

    res.render('profile/view', {
      user: users
  });
})
})

profileController.get('/edit', ensureAuthenticated, (req, res, next) =>{
  User.findById(req.user._id, (err, users) => {
    if (err) { return next(err) }

    res.render('profile/edit', {
      user: users
  });
})
})

profileController.post('/edit', ensureAuthenticated, (req, res, next) =>{
  
  const infoUser = {
    firstName: req.body.firstName, 
    lastName: req.body.lastName,
  };
  
  User.findByIdAndUpdate(req.user._id, infoUser, (err, users) => {
    if (err) { return next(err) }

    res.render('profile/view', {
      user: users
  });
})
})


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect('/login')
  }
}

module.exports = profileController;