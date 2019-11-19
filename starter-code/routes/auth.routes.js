const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, cb) => cb(null, user._id));
passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", { message: "Introduce un usuario y contraseña" });
    return;
  }

  User.findOne({ username })

    .then(user => {
      if (user) {
        res.render("auth/signup", { message: "El usuario ya existe, merluzo" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(x => res.redirect("/"))
        .catch(x =>
          res.render("auth/signup", {
            message: "Algo fue mal, inténtalo más tarde. Oopsy!"
          })
        );
    })
    .catch(error => {
      next(error);
    });
});

router.get("/login", (req, res) =>
  res.render("auth/login", { message: req.flash("error") })
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

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) =>
  res.render("private", { user: req.user })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;

// PASSPORT: inicialización de sesión
