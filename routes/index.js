const express = require("express");
const router = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const salt = bcrypt.genSaltSync(bcryptSalt);
const { isBoss } = require("../middleware/rolesControl");

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.user)
    if (req.user.roles == "Boss") {
      req.user.boss = true;
    }
  res.render("index");
});
router.get("/employees", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find({ roles: { $ne: "Boss" } })
  .then(employees => {
    res.render("employees/employees", {employees});
  });
});
router.get("/employees/:id/remove", isBoss, (req, res) => {
  User.findByIdAndRemove(req.params.id)
  .then(() => {
    res.redirect("/employees");
  });
});
router.get("/employees/edit",ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("employees/edit")
})
router.post("/employees/:id/edit", ensureLogin.ensureLoggedIn(), (req, res) => {
  const {username,password} = req.body
  const hashPass = bcrypt.hashSync(password,salt)
  User.findByIdAndUpdate(req.params.id,{username,password:hashPass})
  .then((user) => {
    req.user=user
    res.redirect("/");
  })
  .catch(err=>{
    console.log("Error updating")
    res.redirect("/employees/edit")
  })
});

module.exports = router;
