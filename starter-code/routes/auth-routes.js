const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { errorMessage: req.flash('error') });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/user-home",
  failureRedirect: "/login",
  failureFlash: true,
}));

authRoutes.get("/user-home", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("user-home", { user: req.user });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

authRoutes.get('/facebook',
  passport.authenticate('facebook'));

authRoutes.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

authRoutes.get('/github', passport.authenticate('github'));

authRoutes.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = authRoutes;