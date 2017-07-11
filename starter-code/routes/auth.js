const express        = require("express");
const router         = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

var path = require('path');
var debug = require('debug')('express-passport:'+path.basename(__filename));

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});


module.exports = router;
