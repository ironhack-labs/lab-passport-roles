const express = require('express');
const router  = express.Router();
const bodyParser   = require('body-parser');
const User = require("../models/User.model")
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const isBoss = (req,res) => req.user.role === "BOSS"
const isDev = (req,res) => req.user.role === "DEVELOPER"
const isTA = (req,res) => req.user.role === "TA"


/* GET home page */
router.get('/', (req, res, next) => {
      res.render('index');

});

function checkRoles(role)
{
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      console.log("AUTENTICADO")
      return next();
    } else {
      console.log("NO AUTENTICADO")

      res.redirect('/auth/login')
    }
  }
}

module.exports = router;
