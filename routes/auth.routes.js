const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// LOGIN

router.get("/login", (req, res, next) =>
  res.render("login", { "message": req.flash("error") })
);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/delete-documentation",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout();
  res.render("login", { message: "Sesión cerrada" });
});

module.exports = router;
