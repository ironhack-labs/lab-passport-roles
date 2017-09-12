const express        = require("express");
const employees      = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");


function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/private');
    }
  };
}

function checkNotRole(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role !== role) {
      return next();
    } else {
      res.redirect('/private');
    }
  };
}

// Can I put the ensureLogin.ensureLoggedIn() in a middleware at the
// top somehow so it works for all functions on this page without having to put it in each function seperately???


// View Employees
employees.get("/view", ensureLogin.ensureLoggedIn(), checkNotRole('STUDENT'), (req, res, next) => {
  User.find({ role: { $ne: 'STUDENT' } }, (err, employees) => {
    if (err) { return next(err); }
    else {
      res.render("employees/view", { employees, currentUser: req.user });
    }
  });
});


// Create Employee Page
employees.get("/new", ensureLogin.ensureLoggedIn(), checkRoles('BOSS'), (req, res, next) => {
  res.render("employees/new");
});


// Save Employee in db
employees.post("/view", ensureLogin.ensureLoggedIn(), checkRoles('BOSS'), (req, res, next) => {
  const username    = req.body.username;
  const password    = req.body.password;
  const name        = req.body.name;
  const familyName  = req.body.familyName;
  const role        = req.body.role;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      name,
      familyName,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("employees/new", { message: "Something went wrong" });
      } else {
        res.redirect("/employees/view");
      }
    });
  });
});




// Edit Employee
employees.get('/:userId/edit', ensureLogin.ensureLoggedIn(), checkNotRole('STUDENT'), (req, res, next) => {
  const userId = req.params.userId;
  if (req.user._id == userId) {         // This didn't work with ===, not sure why not??? Is one of them not a string?
    res.render('employees/edit', {employee: req.user});
  } else {
    res.redirect('/private');
  }
});

employees.post('/:userId/edit', ensureLogin.ensureLoggedIn(), checkNotRole('STUDENT'), (req, res, next) => {
  const userId = req.params.userId;
  if (req.user._id == userId) {           // Same here...
    const updates = {
      name: req.body.name,
      familyName: req.body.familyName,
    };

    if (req.body.password) {
      updates.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(bcryptSalt));
    }

    User.findByIdAndUpdate(userId, updates, (err, user) => {
      if (err) { return next(err); }
      else {
        res.redirect('/employees/view');
      }
    });
  } else {
    res.redirect('/private');
  }
});



// Delete Employee
employees.get('/:userId/delete', ensureLogin.ensureLoggedIn(), checkRoles('BOSS'), (req, res, next) => {
  const userId = req.params.userId;
  User.findByIdAndRemove(userId, (err, user) => {
    if (err) { return next(err); }
    else {
      res.redirect('/employees/view');
    }
  });
});




module.exports = employees;
