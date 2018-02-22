const express = require("express");
const users = express.Router();
const passport = require("passport");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const Student = require('../models/student')
const ensureLogin = require("connect-ensure-login");



module.exports = Student;