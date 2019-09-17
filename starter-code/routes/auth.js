const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const checker = require("../middlewares/checker");

router.get("/signup", checker.checkRole("Boss"), (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, password, role } = req.body;

  if (username === "" || password === "") {
    return res.render("auth/signup", {
      message: "Please indicate a username and password"
    });
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/signup", { message: "Username already exists!" });
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = {
        username,
        password: hashedPassword,
        role
      };

      User.create(newUser)
        .then(createdUser => {
          req.flash("msg", "User created!");
          res.redirect("/login");
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get("/login", (req, res) => {
  res.render("auth/login", {
    message: req.flash("Error while trying to Log In")
  });
});

router.post(
  "/login",
  passport.authenticate("local-auth", {
    successRedirect: "/private",
    failureRedirect: "/login",
    passReqToCallback: true,
    failureFlash: true
  })
);

router.get("/private", checker.checkLogin, (req, res, next) => {
  User.find()
    .select({ username: 1, role: 1 })
    .then(user => {
      return (employees = user.filter(employee => employee.role !== "Boss"));
    })
    .then(employees => {
      res.render("auth/private", {
        employees,
        user: req.user,
        message: req.flash("msg")
      });
    });
});

router.get("/admin", checker.checkRole("Boss"), (req, res, next) => {
  res.render("auth/admin", { user: req.user });
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/auth/facebook",
  passport.authenticate("facebook"));

router.get("/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/private");
  });

module.exports = router;
