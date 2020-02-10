const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// router.post("/", (req, res, next) => {
//   res.render("index");
// });

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/private",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = router;
