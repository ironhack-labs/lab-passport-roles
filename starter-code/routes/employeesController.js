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
  User.find({}, (err, docs) => {
    if (err) { return next(err); }
    console.log(docs);
    return res.render("employees/list", {docs});
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
      role: 'Developer'
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

module.exports = employeesController;
