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



router.get("/signup", isBoss, (req, res) => {
  res.render("passport/signup");
});


router.post("/signup", isBoss, (req, res) => {
  const { username, password,roles } = req.body;
  const hashPass = bcrypt.hashSync(password, salt);
  User.create([{ username, password: hashPass,roles }])
    .then(user => {
      console.log("sign up succes");
      res.redirect("/");
    })
    .catch(err => {
      console.log(err.message);
    });
});

router.get("/login", (req, res) => {
  res.render("passport/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
