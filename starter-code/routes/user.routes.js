const express = require("express");
const passportRouter = express.Router();

const user = require('../models/user');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require('passport');

const ensureLogin = require("connect-ensure-login");

//_-----------------
passportRouter.get("/login", (req, res) => {
  res.render("passport/login")
})