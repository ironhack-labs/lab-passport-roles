// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();

// User model
const User = require("../models/User");
const passport = require("passport");
const { ensureAuthenticated, checkRoles } = require("../passport/auth-roles");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/", (req, res, next) => {
  res.render("index");
});

authRoutes.get('/signup', checkRoles('Boss'), (req, res, next) => {
  res.render('auth/signup', {user: req.user});
});

authRoutes.post("/signup", (req, res, next) => {
  
  // const { username, password, name, familyName, role } = req.body
  
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const role = req.body.role;

  if (username === "" || password === "" ) {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      name,
      familyName,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/auth/login"
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



module.exports = authRoutes;