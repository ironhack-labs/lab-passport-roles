const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const ensureLoggedOut = require('../middlewares/ensureLoggedOut');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const isBoss = require('../middlewares/isBoss');

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;



authRoutes.get('/bosspage',[ensureLoggedIn('/auth/login'),isBoss('/')], (req, res, next) => {
  console.log(req.user.role)
  res.render('auth/bosspage',{user:req.username});
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});


authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/bosspage",
    failureRedirect: "/auth/login",
    failureFlash: false,
    passReqToCallback: false
  })
);



module.exports = authRoutes;