const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");




const checkSuperAdmin = () => {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "Boss") {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkTeacher = () => {
  return function(req, res, next) {
    if (req.isAuthenticated() &&
    (req.user.role === "Boss" ||
    req.user.role === "Teacher"
    )) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}
const checkAdmin = () => {
  return function(req, res, next) {
    if (req.isAuthenticated() &&
    (req.user.role === "Boss" ||
    req.user.role === "Teacher" ||
    req.user.role === "Developer"
    )) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}




router.get("/", ensureLogin.ensureLoggedIn(), (req, res) => {
  let superAdmin = false;
  let teacher = false;
  let admin = false;
  const name = req.user.name;
  const user = req.user;
  if (req.user.role.includes("Boss")) {
    superAdmin = true;
    teacher = true;
    admin = true;
  }
  if (req.user.role.includes("TA")) {
    teacher = true;
    admin = true;
  }
  if (req.user.role.includes("Developer")) {
    admin = true;
  }
  res.render("index", { title: `Welcome, ${name}`, subtitle: "Find your option below", user, superAdmin, teacher, admin});
});



router.get("/admin/list", [ensureLogin.ensureLoggedIn(), checkAdmin()], (req, res) => {
  let superAdmin = false;
  const user = req.user;
  if (req.user.role.includes("Boss")) {
    superAdmin = true;
  }
  User.find({ $or:[{role:"Developer"},{role:"Boss"},{role:"TA"}]})
  .then(admins => {
    res.render('admin/admins_list', {title: "All employees", subtitle:"Those are your peers", admins, superAdmin, user});
  })
  .catch(err => next(err));
});






module.exports = router;
