const express = require('express');
const authRoute  = express.Router();
const passport     = require("passport");
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const flash = require("connect-flash");

const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTa  = checkRoles('TA');
const checkStudent  = checkRoles('STUDENT');

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function checkmultipleRoles(roleArray) {
  return function(req, res, next) {
    for (x=0; x< roleArray.length; x++){
    if (req.isAuthenticated() && req.user.role === roleArray[x]) {
      return next();
    }} 
      res.redirect('/login')
    
  }
}

authRoute.get("/login", (req, res, next) => {
  res.render("login");
});

authRoute.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoute.get('/employeeInput', checkBoss, (req, res) => {
  User.find()
  .then(users => {
    let data = {
      employees: users,
      user: req.user
    }
    res.render('private/employee-input', data);
  })
  .catch(error => {
    console.log(error)
  })
  
});

authRoute.post("/employeeInput", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("private/employee-input", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("private/employee-input", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("/employee-input", { message: "Something went wrong" });
      } else {
        res.redirect("/employeeInput");
      }
    });
  });
});

authRoute.get("/deleteEmployee/:id", (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
  .then(res.redirect("/employeeInput"))
  .catch(res.redirect("/employeeInput"));
});

authRoute.get('/showEmployees', checkmultipleRoles(['DEVELOPER', 'TA']), (req, res) => {
  User.find()
  .then(users => {
    let data = {
      employees: users,
      user: req.user
    }
    res.render('private/display-employees', data);
  })
  .catch(error => {
    console.log(error)
  })
  
});

module.exports = authRoute;