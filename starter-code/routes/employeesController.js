const express = require('express');
const employeesController = express.Router();
const ensureLogin = require('connect-ensure-login');
const bcrypt = require('bcrypt');
const User = require('../models/User');

employeesController.get('/', ensureLogin.ensureLoggedIn(), checkRoles('Boss'), (req, res, next) => {
  User.find({role: { $not:/Boss/ }},(err, users)=> {
    err ? next(err) : res.render('employees/index', {employees: users});
  })
});

employeesController.get('/new', ensureLogin.ensureLoggedIn(), checkRoles('Boss'), (req, res, next) => {
  res.render('employees/new');
});

employeesController.post('/', ensureLogin.ensureLoggedIn(), checkRoles('Boss'), (req, res, next) => {

  var employeeData = {
    name: req.body.name,
    familyName: req.body.familyName,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
    role: req.body.role
  }

  var newUser = new User(employeeData);
  newUser.save((err) => {
    err ? res.render('employees/new', { errorMessage: err }) : res.redirect('/employees');
  });
});

employeesController.post('/:id/delete', (req, res, next) => {
  let id = req.params.id

  User.findByIdAndRemove(id, (err, user) => {
    return  err ? next(err) : res.redirect('/employees');
  });
});


function checkRoles(role) {
  return function(req, res, next) {
    if (req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = employeesController;
