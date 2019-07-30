const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login"); // Asegurar la sesión para acceso a rutas

const authRoutes = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => res.render("signup"));
authRoutes.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("signup", { message: "Rellena todo" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("signup", { message: "El usuario ya existe" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save(err => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/roles/boss",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/roles/boss", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("roles/boss", { user: req.user });
});

module.exports = authRoutes;
