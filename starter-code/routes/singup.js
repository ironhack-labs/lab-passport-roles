// routes/private-routes.js
const express    = require("express");
const privateRoutes = express.Router();

// User model
const User       = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

privateRoutes.get("/signup", (req, res, next) => {
  res.render("private/signup");
});

privateRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "" || name === "" || familyName === "" || role === "") {
    res.render("private/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("private/signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass,
      name : name,
      familyName : familyName,
      role : role
    });

    newUser.save((err) => {
      if (err) {
        res.render("private/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

module.exports = privateRoutes;
