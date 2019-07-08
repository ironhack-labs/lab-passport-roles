const express = require("express");
const bossRouter = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/user");
const Course = require('../models/Course');


bossRouter.get("/boss-profile", (req, res, next) => {

  User.find()
    .then(users => {
     
      res.render("boss/bossProfile", { users });
    })
    .catch(next);
});


bossRouter.post("/boss/:id/deleteUser", (req, res, next) => {
  let userId = req.params.id;

  User.findByIdAndRemove({ _id: userId })
    .then(() => {
      res.redirect("/profiles");
    })
    .catch(next);
});



bossRouter.get("/boss/createUser", (req, res, next) => {
  res.render("boss/create");
});


bossRouter.post("/boss/newUser", (req, res, next) => {
  var objUser = {
    username: req.body.username,
    role: req.body.role,
    password: req.body.password
  };

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashedPassword = bcrypt.hashSync(objUser.password, salt);

  const newUser = new User();

  newUser.username = objUser.username;
  newUser.role = objUser.role;
  newUser.password = hashedPassword;

  newUser
    .save()
    .then(() => {
      res.redirect("/boss-profile");
    })
    .catch(() => {
      req.redirect("/boss-profile");
    });
});

module.exports = bossRouter;