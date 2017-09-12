const express = require("express");
const dbController = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 12;
const Employee = require("../models/employee");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      console.log("ROLES", req.user.role);
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkDeveloper = checkRoles('Developer');
const checkBoss  = checkRoles('Boss');

dbController.get("/home", checkBoss, (req, res, next) =>{
  res.render("account",{user: username},{})
})
