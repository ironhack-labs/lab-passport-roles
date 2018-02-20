const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const User = require("./models/User");
const Course = require("./models/Course");
//ensure login
const ensureLogin = require("connect-ensure-login");
//passport
const passport = require("passport");

//check roles
const checkStudant  = checkRoles('Studant');
const checkTa = checkRoles('TA');
const checkDev = checkRoles('Developer');
const checkBoss  = checkRoles('Boss');


router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
