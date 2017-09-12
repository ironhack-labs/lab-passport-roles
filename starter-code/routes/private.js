const express        = require("express");
const private        = express.Router();
const ensureLogin    = require("connect-ensure-login");

// Render dashboard
private.get("/", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("private", {user: req.user});
});

// Log-out
private.get("/logout", ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = private;
