const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login"); // Asegurar la sesión para acceso a rutas

const authRoutes = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//! SIGN UP
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

//!LOG IN

authRoutes.get("/login", (req, res, next) => {
  res.render("login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/list",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

//!LOGOUT

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => res.render("private", { user: req.user }));

module.exports = authRoutes;

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//!DISPLAY LIST OF USERS
authRoutes.get("/list", (req, res, next) => {
  User.find({})
    .then(allUsers => res.render("list", { allUsers }))
    .catch(err => console.log("There was an error:", err));
});

//! DISPLAY USER DETAILS
authRoutes.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  const userId = req.params.id;
  User.findById(userId)
    .then(fullUser => res.render("details", { fullUser }))

    .catch(err => {
      console.log("There was an error", err);
      next();
    });
});

//! EDIT CELEBRITY
authRoutes.get("/:id/edit", (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then(originalUser => res.render("edit", { originalUser }))
    .catch(err => console.log("Ha habido un error: ", err));
});

authRoutes.post("/:id/edit", (req, res, next) => {
  const userId = req.params.id;
  const { username, password, role } = req.body;

  User.findByIdAndUpdate(userId, { $set: { username, password, role } }, { new: true })
    .then(modedUser => {
      console.log(modedUser);
      res.redirect("/list");
    })
    .catch(err => console.log("Hubo un error:", err));
});

module.exports = authRoutes;
