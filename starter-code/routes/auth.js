const express        = require("express");
const siteController  = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

siteController.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));
  siteController.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/auth/login");
});


module.exports = siteController;
