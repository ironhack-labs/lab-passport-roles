const express = require("express");
const usersController = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// User model
const User = require("../models/user");

//Function to check roles
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}

const checkBoss = checkRoles("Boss");
const checkDeveloper = checkRoles("Developer");
const checkTA = checkRoles("TA");

usersController.get("/", (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) return next(err);
    res.render("users/index", {
      users
    });
  });
});

usersController.get("/new", checkBoss, (req, res) => {
  res.render("users/new");
});

usersController.post("/", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("(users/new", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("users/new", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      name: name,
      familyName: familyName,
      password: hashPass,
      role: role
    });

    newUser.save(err => {
      if (err) {
        return res.render("users/new", { message: "Something went wrong" });
      } else {
        return res.redirect("/users/");
      }
    });
  });
});

usersController.post("users/:id/delete", (req, res, next) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) return next(err);
    res.redirect("/users");
  });
});

module.exports = usersController;
