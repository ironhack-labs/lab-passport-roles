const express = require("express");
const siteController = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

siteController.get("/", ensureAuthenticated, (req, res, next) =>{
  User.find({}, (err, results) => {
    if (err) {
      next(err);
    }
    res.render("logged/admin/showEmployees", {
      results
    });
  });
});

siteController.get("/addEmployee", ensureAuthenticated, (req, res, next) =>{
  res.render("logged/admin/addEmployee");
});

siteController.post("/addEmployee", ensureAuthenticated, (req, res, next) =>{
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
      newEmployee.save((err) => {
        res.redirect("/portal");
      });
    });
});

siteController.get("/:id/editEmployee", ensureAuthenticated, (req, res, next) => {
  User.findById(req.params.id, (err, results) => {
    if (err) {
      next(err);
    };
    res.render("logged/admin/editEmployee", results);
  });

});

siteController.post("/:id/editEmployee", ensureAuthenticated, (req, res, next) => {
  let hashPass = bcryptPassConverter(req.body.password);
  let editEmployee = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    password: hashPass,
    role: req.body.role
  };
  User.findByIdAndUpdate(req.params.id, editEmployee, (err, product) => {
    if (err) {
      return next(err);
    }
    res.redirect('/portal/admin');
  });
});

siteController.post("/:id/deleteEmployee", ensureAuthenticated, (req, res, next) => {
  User.findByIdAndRemove(req.params.id, (err, product) => {
    if (err) {
      return next(err);
    }
    res.redirect('/portal/admin');
  });

});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role == 'Boss') {
    return next();
  } else {
    res.redirect('/portal');
  }
}

function bcryptPassConverter(password) {
  return hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptSalt));
}
module.exports = siteController;
