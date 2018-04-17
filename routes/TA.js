const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const passport = require("passport");
const flash = require("connect-flash");
const isTA = require("../middlewares/isTA");
const User = require("../models/user");

router.get("/", [ensureLoggedIn("/login"), isTA("/")], (req, res) => {
  res.render('index');
});


module.exports = router;