const express        = require("express");
const router         = express.Router();
const Roles           = require("../models/Roles");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const checkTA = checkRoles('TA');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTAorDeveloper = check2Roles('TA','DEVELOPER');

router.get('/', checkTAorDeveloper, (req, res, next) => {
    Roles.find().then(roles => {
    res.render('employees/otherUsers', {user: req.user, roles});
  })
  .catch((error) => {
    console.log(error)
    next();
  })
});

router.get('/:id', checkTAorDeveloper, (req, res, next) => {

  let employeeId = req.params.id;
  if (!employeeId) { 
    return res.status(404).render('not-found');
  }
  Roles.findById(employeeId)
    .then(employee => {
      if (!employee) {
          return res.status(404).render('not-found');
      }
      res.render("employees/profile", employee)
    })
    .catch(next)
});

router.get('/:id/edit', (req, res, next) => {
  let employeeId = req.params.id;
  Roles.findById(employeeId)
  .then((employees) => {
    res.render("employees/editEmployee", employees)
  })
  .catch((error) => {
    console.log(error)
  })
});

router.post('/:id/edit', (req, res, next) => {
  let employeeId = req.params.id;
  const { username, password, role } = req.body;
  Roles.update({_id: employeeId}, { $set: { username, password, role }},{new: true})
  .then((e) => {
    res.redirect('/otherUsers')
  })
  .catch((error) => {
    console.log(error)
  })
});

function check2Roles(role1,role2) {
  return function(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === role1 || req.user.role === role2)) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = router;