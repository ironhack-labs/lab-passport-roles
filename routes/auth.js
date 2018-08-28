const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { error: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = router;
