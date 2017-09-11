var express = require('express');
var siteController = express.Router();
const User = require('../models/User');
const {isBoss} = require('../middleware/authMiddleware');

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin     = require("connect-ensure-login");
const passport        = require("passport");


siteController.get('/', function(req, res, next) {
  console.log(req.user);
  if(req.user){
    User.find({}, (err, e) => {
      console.log(e);
      if (err) {
          next();
          return err;
        } else {
          res.render('employee/index', {employees: e});
        }
    });
  } else {
    res.redirect('/auth/login');
  }

});

siteController.get('/new', isBoss, function(req, res, next) {
  res.render('employee/new');
});

siteController.post('/new', isBoss, function(req, res, next) {
  let {username, name, familyName, password, role} = req.body;

    if (username === "" || password === "") {
      res.render("employee/new", { message: "Indicate username and password" });
      return;
    }

    User.findOne({ username }, "username", (err, user) => {
      if (user !== null) {
        res.render("employee/new", { message: "The username already exists" });
        return;
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newEmployee = User({
        username: username,
        password: hashPass,
        name: name,
        familyName: familyName,
        role: role
      });

      console.log(newEmployee);

      newEmployee.save((err) => {
        if (err) {
          res.render("employee/new", { message: "Something went wrong" });
        } else {
          console.log('new employee created');
          res.redirect("/employee");
        }
      });
    });
});

siteController.get('/:id/delete', isBoss, function(req, res, next) {
  let id = req.params.id;
  User.findByIdAndRemove(id, (err, obj) => {
    if (err){ return next(err); }
    res.redirect("/employee");
  });
});

module.exports= siteController;
