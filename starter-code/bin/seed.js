const mongoose = require('mongoose')
const dbName = 'lab-passport-roles'
mongoose.connect(`mongodb://localhost/${dbName}`)
const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10
// Add passport 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

const ensureLogin = require("connect-ensure-login");





  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync("123", salt)
  User.create({ username: "PepeDaBowss", password: hashPass, role: "BOSS" })
  .then(createdUser => {
    console.log(createdUser)
    mongoose.connection.close()
    
  })
  .catch(err => console.log("Algo no va bien", err))
