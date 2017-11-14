const express             = require("express");
const User                = require("../models/User");
const bcrypt              = require('bcrypt');
const bcryptSalt          = 10;
const path                = require('path');
const passport            = require("passport");
const siteController      = express.Router();
const debug               = require('debug')('ibi-ironhack:'+ path.basename(__filename));
//const checkRoles          = require("../middlewares/checkRoles");
//const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

siteController.get("/", (req, res) => {
  res.render("index", {user: req.user});
});

siteController.get("/login", (req, res) => {
  res.render("auth/login");
});

siteController.post("/login",
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

siteController.get("/employees", checkRoles('Boss'), (req, res) => {
  User.find({$or: [ {role: 'Developer'}, {role: 'TA'} ]})
       .then((data) => {
         res.render("employees/index", {data: data, user: req.user});
         console.log(user);
       }, (err) => {
         next(err);
       });
});

siteController.post("/employees/create", checkRoles('Boss'), (req, res) => {
  const pass = req.body.password;
  let salt = bcrypt.genSaltSync(bcryptSalt);
  const employeeInfo = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    password: bcrypt.hashSync(pass, salt),
    role: req.body.role
  };
  const newEmployee = new User(employeeInfo);
  newEmployee.save()
             .then(() => {
               return res.redirect("/employees");
             }, (err) => {
               next(err);
             });
});

siteController.post("/employees/:id/delete", checkRoles('Boss'), (req, res) => {
  const employeeId = req.params.id;
  User.findByIdAndRemove(employeeId)
      .then(() => {
        return res.redirect("/employees");
      }, (err) => {
        next(err);
      });
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  };
}


module.exports = siteController;
