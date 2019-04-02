const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/privatefb",
    failureRedirect: "/login"
  })
);

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
      err: "Las contraseñas no coinciden"
    });

  User.register({ email, name, lastname }, password).then(user => {
    res.redirect("/auth/login");
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

router.get('/:id/edit', (req, res) => {
  let { id } = req.params;
  User.findById(id)
  .then(user => {
    res.render('perfil', {user});
  });
});

router.post('/:id/edit', (req, res) => {
  let { id } = req.params;
  User.findByIdAndUpdate(id, {$set: {...req.body}})
  .then(user => {
    res.redirect('/private');
  })
  .catch(err => {
    console.log(err);
  })
});

module.exports = router;