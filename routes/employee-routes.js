const express         = require("express");
const employeeRoutes  = express.Router();
const passport        = require("passport");
const flash           = require("connect-flash");
const User            = require("../models/user");
const Profile         = require('../models/profile');


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

// employeeRoutes.get('/employees/new', (req, res, next) => {
//   res.render('employees/new')
// })

employeeRoutes.post('/employees/create', ensureAuthenticated, (req, res, next) => {
  const newEmployee = new User ({
    username:  req.body.empUsername,
    password:  req.body.empPassword,
    role: req.body.empRole,
  });

  newEmployee.save ((err) => {
    if (err) { return next(err); }
    else {
      res.redirect('/employees');
    }
  })
});

employeeRoutes.get('/employees', (req, res, next) => {
  User.find({}, (err, theUsers) => {
    if (err) { return next(err); }
    res.render('employees/index', { users: theUsers });
  });
});


// Edit
employeeRoutes.get('/employees/edit/:id', (req, res, next) => {
  const employeeId = req.params.id;
  User.findById(employeeId)
  .then(user => {
    res.render('employees/edit-page', {user: user})
  })
  .catch(error => {
    console.log("There is an error editing the user:", error);
  })
})

employeeRoutes.post('/employees/update/:id', (req, res, next) => {
  const employeeId = req.params.id;
  User.findByIdAndUpdate(employeeId, {
    username : req.body.editedUsername,
    password: req.body.editedPassword
  })
    .then(user => {
    })
    .catch(error => {console.log("There is an error posting the updated information:", error) })
  res.redirect('/employees/')
})



module.exports = employeeRoutes;