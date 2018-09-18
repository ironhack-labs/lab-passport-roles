const express = require('express');
const passport = require("passport");
const authRoutes = express.Router();
// User model
const User = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// authRoutes.get("/signup", ensureLoggedOut('/specialpage'), (req, res, next) => {
// 	res.render("auth/signup");
// });

