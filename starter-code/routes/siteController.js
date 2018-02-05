const express = require("express");
const siteController = express.Router();
const { ensureAuthenticated, checkRoles } = require("../passport/auth-roles");
const User = require('../models/User');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/private", (req, res, next) => {
  if(req.user.role === "Boss"){
    User.find({}).exec().then( users => {
      res.render("private/users", {users});
    }).catch(e => next(e))
  } else{
    res.render("index");
  }
});

siteController.get("/delete/user/:id", (req,res,next) => {
  const userId = req.params.id;
  console.log(userId)
  User.findById(userId).exec().then( user =>{
    user.remove();
  }).then(() => {
    res.redirect("/private")
  }).catch(e => next(e))
});

module.exports = siteController;
