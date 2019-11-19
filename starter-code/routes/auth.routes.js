const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  if (!username || !password) {
    res.render("signup", {
      message: "Introduce un usuario y contraseña"
    });
    return;
  }

  User.findOne({
      username
    })

    .then(user => {
      if (user) {
        res.render("signup", {
          message: "El usuario ya existe"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username,
          password: hashPass
        })
        .then(x => res.redirect("/"))
        .catch(x =>
          res.render("signup", {
            message: "Algo fue mal, inténtalo más tarde. Oopsy!"
          })
        );
    })
    .catch(error => {
      next(error);
    });
});

router.get("/login", (req, res) =>
  res.render("login", {
    message: req.flash("error")
  })
);

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