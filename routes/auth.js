const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
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

router.get("/create", (req, res, next) => {
  res.render("auth/create", { error: req.flash("error") });
});

router.post("/create", (req, res, next) => {
  const { username, password, role } = req.body;

  const encrypted = bcrypt.hashSync(password, 10);

  new User({ username, password: encrypted, role })
    .save()
    .then(result => {
      res.render("auth/create", { success: "employee was created!" });
    })
    .catch(err => {
      if (err.code === 11000) {
        return res.render("auth/create", { error: "user exists already" });
      }
      console.error(err);
      res.send("something went wrong");
    });
});

module.exports = router;
