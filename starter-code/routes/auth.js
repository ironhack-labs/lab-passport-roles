const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/facebook", passport.authenticate ("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook",{
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
    failureFlash:"Cuenta no valida"
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


router.get("/login", (req, res) => {
  res.render("auth-form", { login: true });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/auth/login",
    failureFlash: "Email o contraseña invalidos"
  })
);

router.get("/register", (req, res) => {
  res.render("auth-form");
});

router.post("/register", (req, res) => {
  let { password, email, passwordConfirm, name, lastname } = req.body;

  if (password !== passwordConfirm)
    return res.render("auth-form", {
      err: "Las contras no son las mismas perro"
    });

  User.register({ email, name, lastname }, password).then(user => {
    res.redirect("/auth/login");
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;