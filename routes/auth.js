const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const { ensureLoggedIn } = require("../middleware/ensureLogin");

router.get("/login", (req, res, next) => {
  res.render("auth/login");
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

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/edit", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("auth/edit", {
    user: req.user
  });
});

router.post("/edit/", ensureLoggedIn("/auth/login"), (req, res, next) => {
  const user = req.user;
  const { username, password } = req.body;
  const modUser = { username };

  if (password !== "") {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    modUser.password = hashPass;
  }

  User.findByIdAndUpdate(user._id, modUser)
    .then(data => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/edit", {
        user,
        errorMessage: err.message
      });
    });
});

module.exports = router;
