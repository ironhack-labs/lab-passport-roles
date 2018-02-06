const express = require("express");
const authRoutes = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport')
const User = require("../models/User");
const bcryptSalt = 10;




authRoutes.get("/login", (req, res, next) => {
        res.render("/views/private");
  });
  
  authRoutes.post("/login", passport.authenticate("local", {
    successRedirect: "/views/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }));