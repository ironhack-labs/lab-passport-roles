const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user.model");
const secure = require("../middlewares/secure.mid");



const router = express.Router();
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Please indicate username and password"
    });
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/signup", { message: "Username already exists" });
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      newUser
        .save()
        .then(() => res.redirect("/boss"))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local-auth", {
    successRedirect: "/boss",
    failureRedirect: "/login",
    passReqToCallback: true,
    failureFlash: true
  })
);

router.get(
  "/boss",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("auth/boss", { user: req.user });
  }
);
// router.get("/private", secure.checkLogin, (req, res, next) => {
//   res.render("auth/private", { user: req.user });
// });

// router.get("/admin", secure.checkRole("ADMIN"), (req, res, next) => {
//   res.render("auth/admin", { user: req.user });
// });

// router.get("/logout", (req, res, next) => {
//   req.logout();
//   res.redirect("/");
// });

module.exports = router;
