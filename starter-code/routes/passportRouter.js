const express = require("express");
const router = express.Router();

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");
const isTA = user => user && user.role === "TA"

const checkRole = roles => (req, res, next) => req.user && roles.includes(req.user.role) ? next() : res.render("index", {
  roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí`
})

//LOGIN

router.get("/login", (req, res) => res.render("passport/login", {
  message: req.flash("error")
}))
router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))


//Logout
router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")
})

// SIGN UP
router.get("/signup", checkRole(['BOSS']), (req, res) => res.render("passport/signup"));

router.post("/signup", (req, res) => {
  const {
    username,
    password,
    role
  } = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Rellena los campos"
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render("passport/signup", {
          message: "El usuario ya existe"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username,
          password: hashPass,
          role
        })
        .then(() => res.redirect("/"))
        .catch(() =>
          res.render("passport/signup", {
            message: "Something went wrong"
          })
        );
    })
    .catch(error => next(error));
});



module.exports = router;