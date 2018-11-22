const express = require("express");
const authRoutes = express.Router();
const User = require("../models/User");
const passport = require('passport')
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const {roleCheck} = require("../middlewares/roleCheck")
/* GET home page */
authRoutes.get("/", (req, res, next) => {
  res.render("index");
});


authRoutes.get('/signup',roleCheck("Boss"), (req,res) => {
  res.render('auth/signup');
})
authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});
authRoutes.post("/signup",   (req, res, next) => {
  const username = req.body.username;
  const role = req.body.role;
  const password = req.body.password;
  if (username === "" || password === "" ) {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      role,
      username,
      password: hashPass
    });

    newUser.save(err => {
      res.redirect("/");
    });
  });
});
authRoutes.post("/login", passport.authenticate('local',{
  failureRedirect:'/login',
  successRedirect:'/'

}))

module.exports = authRoutes;
