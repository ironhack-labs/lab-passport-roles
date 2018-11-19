const express = require('express');
const router  = express.Router();
const passport = require("passport");
// const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/roleAdd", (req, res, next) => {
  res.render("roleAdd");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/roleAdd",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

module.exports = router;
