const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');
const debug = require('debug')("app:auth:local");
const router = require('express').Router();
const checkRoles = require('../middlewares/checkRoles');
// const ensureLogin = require("connect-ensure-login");
// const isLoggedIn = require('../middlewares/isLoggedIn');
const checkBoss  = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');


router.get("/", (req, res, next) => {
  res.render("courses/index");
});
