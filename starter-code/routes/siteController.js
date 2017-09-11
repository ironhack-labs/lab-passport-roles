const express = require("express");
const siteController = express.Router();
const ensureLogin    = require("connect-ensure-login");
const User = require('../models/user.js').user;
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const roles= ["Boss", "Developer", "TA"];

siteController.get("/listEmployee", ensureLogin.ensureLoggedIn("/"),(req, res, next) => {
  User.find({}, (err, docs) => {
  if(err) {
    next();
  }
  else {
    res.render('listEmployee', {docs: docs});
    return;
  }
  });
});

siteController.get("/newEmployee", checkRoles("Boss"),(req, res, next) => {
  res.render("newEmployee", {roles});
});

//TODO: - Refactor - same code on passportRouter
siteController.post("/newEmployee", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("newEmployee", { roles: roles, message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("newEmployee", { roles: roles, message: "The username already exists" });
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
    newUser.save((err) => {
      if (err) {
        res.render("newEmployee", {roles: roles, message: "Something went wrong" });
      } else {
        res.render("newEmployee", {roles: roles, message: "Added"});
      }
    });
  });
});

siteController.get("/editProfile", ensureLogin.ensureLoggedIn("/"),(req, res, next) => {
  res.render("editProfile", {user: req.user, roles: roles});
});

//TODO: - DRY!!
siteController.post("/editProfile", ensureLogin.ensureLoggedIn("/"),(req, res, next) => {
  const username = req.body.username;
  const oldUsername = req.user.username;
  const password = req.body.password;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const role = req.body.role;
  const id = req.user._id;

  let modified = {};

  if (username === "") {
    res.render("editProfile", { user: req.user, roles: roles, message: "Username can't be empty" });
    return;
  }


//TODO: - Is asynchronus.
//TODO: Think how to check if want to change the username and dat username isnt in the db already
  // if (username !== oldUsername) {
  //   User.findOne({ username }, "username", (err, user) => {
  //
  //     if (user !== null) {
  //       console.log("--------------Find it!!!");
  //       res.render("editProfile", {user: req.user, roles: roles, message: "The username already exists" });
  //       return;
  //     }
  //   });
  // }

  if(password){
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    modified.password = hashPass;
  }
  if (name){
    modified.name = name;
  }
  if(familyName) {
    modified.familyName = familyName;
  }
  if (role) {
    modified.role = role;
  }

  User.findByIdAndUpdate(id, modified, (err, user) => {
    if (err) {
      res.render("editProfile", {user: user, roles: roles, message: "Something wrong" });
      return;
    }
    //TODO:- Check why dont change the fields when we are rendering again
    res.render("editProfile", {user: user, roles: roles, message: "Edited" });
  });
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/welcome');
    }
  };
}

module.exports = siteController;
