const express = require("express");
const siteController = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const mongoose     = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

siteController.get("/", (req, res, next) => {
  res.render("logged/portal", req.user);
});

siteController.get("/edit", (req, res, next) => {
  res.render("logged/edit", req.user);
});

siteController.post("/edit", (req, res, next) =>{

  let editProfile = {
    name: req.body.name,
    familyName: req.body.familyName
  };

User.findByIdAndUpdate(req.user.id, editProfile, (err, product) => {
  if (err) {
    return next(err);
  }
  res.redirect('/portal/');
  });
});

siteController.get("/addEmployee", (req, res, next) =>{
  res.render("logged/admin/addEmployee");
});

siteController.post("/addEmployee", (req, res, next) =>{
  // SAVE data username, password, name, email
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const familyName = req.body.familyName;
  const role = req.body.role;

  if (username === "" || password === "" ||
          name === "" ||  familyName === "" || role === "") {
    res.render("logged/admin/addEmployee", {
      errorMessage: "Please, fill all fields"
    });
    return;
  }
  // if all is filled, search in bbdd
  User.findOne({
      "username": username
    },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("logged/admin/addEmployee", {
          errorMessage: "The username already exists"
        });
        return;
      }
      // if not exist, create and encrypt password
      let hashPass = bcryptPassConverter(password);

      let newEmployee = User({
         username,
         name,
         password : hashPass,
         familyName,
         role
      });
      console.log(newEmployee);
      newEmployee.save((err) => {
        res.redirect("/portal");
      });
    });
});

function bcryptPassConverter(password) {
  return hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptSalt));
}
module.exports = siteController;
