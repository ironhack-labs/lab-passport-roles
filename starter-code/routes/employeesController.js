const express = require("express");
const employeesController = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");


employeesController.get("/list", (req, res, next) => {
  const user = req.user;

  User.find({}, (err, docs) => {
    if (err) { return next(err); }
    console.log(docs);
    return res.render("employees/list", {docs, user});
  });
});

employeesController.get('/add', (req, res, next) => {
  res.render('employees/add');
});

employeesController.post('/list', (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("employees/add");
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("employees/add");
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newEmployee = new User({
      username: username,
      name: name,
      familyName: familyName,
      password: hashPass,
      role: role
    });

    newEmployee.save(err => {
      if (err) { return res.render('employees/add'); }
      return res.redirect('/list');
    });
  });
});

employeesController.get('/remove/:id', (req, res, next) => {
  let employeeId = req.params.id;

  User.findByIdAndRemove(employeeId, (err, employee) => {
    if (err) { return next(err); }
    return res.redirect('/list');
  });
});

employeesController.get('/see/:id', (req, res, next) => {
  let employeeId = req.params.id;

  User.findOne({"_id": employeeId}, (err, employee) => {
    if (err) { return next(err); }
    return res.render("employees/profile", employee);
  });
});

employeesController.get('/edit/:id', (req, res, next) => {
  let user = req.user;
  res.render("employees/edit", user);
});

employeesController.post('/edit/:id', (req, res, next) => {
  let userId = req.params.id;
  let userInfo = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    role: req.body.role
  };

  User.findByIdAndUpdate(userId ,userInfo, (err, user) => {
    if (err) { return next(err); }
    return res.redirect('/account');
  });
});

module.exports = employeesController;
