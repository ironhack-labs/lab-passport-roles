const express = require("express");
const siteController = express.Router();
const { ensureAuthenticated, checkRoles } = require("../passport/auth-roles");
const User = require('../models/User');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/private", ensureAuthenticated,(req, res, next) => {
  if(req.user.role === "Boss"){
    User.find({}).exec().then( users => {
      res.render("private/users", {users});
    }).catch(e => next(e))
  } else{
    user = req.user
    res.redirect(`/private/user/${user._id}`, {user});
  }
});

siteController.get("/private/user/:id", ensureAuthenticated, (req, res, next) => {
  const currentUser = req.user._id;
  const userId = req.params.id;
  User.findById(userId).exec().then( user =>{
    res.render("private/profile", {user, currentUser})
  }).catch(e => next(e))
})

siteController.get("/delete/user/:id", (req,res,next) => {
  const userId = req.params.id;
  User.findById(userId).exec().then( user =>{
    user.remove();
  }).then(() => {
    res.redirect("/private")
  }).catch(e => next(e))
});


module.exports = siteController;
