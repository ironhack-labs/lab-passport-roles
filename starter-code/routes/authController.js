const express = require("express");
const passport = require("passport");

const authController = express.Router();

const checkRoles = (role) => {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/auth/login');
    }
  };
};


authController.get("/signin", (req, res, next) => {
  res.render("auth/signin");
});

authController.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/private",
  failureRedirect: "/auth/signin",
  passReqToCallback: true
}));

authController.get("/private", checkRoles('Boss'), (req, res, next) => {
  res.render("auth/private");
})

module.exports = authController;
