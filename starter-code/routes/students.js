const express        = require("express");
const students        = express.Router();
// User model
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");

// View Students
students.get('/view', (req, res, next) => {
  User.find({ role: 'STUDENT' }, (err, students) => {
    if (err) { return next(err); }
    else {
      console.log(req.user);
      res.render("students/view", { students, currentUser: req.user });
    }
  });
});


// Edit Student details
students.get('/:userId/edit', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const userId = req.params.userId;
  if (req.user._id == userId) {         // This didn't work with ===, not sure why not??? Is one of them not a string?
    res.render('students/edit', {student: req.user});
  } else {
    res.redirect('/private');
  }
});

students.post('/:userId/edit', ensureLogin.ensureLoggedIn(), (req, res, next) => {
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
        res.redirect('/students/view');
      }
    });
  } else {
    res.redirect('/private');
  }
});

module.exports = students;
