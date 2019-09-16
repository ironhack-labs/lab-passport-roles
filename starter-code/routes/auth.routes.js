const authRoutes = require("express").Router();
const authSecurity = require("./../middlewares/sec.mid");
const passport = require("passport");

// const Roles = require("./../models/Roles.model");

// Render the add-employees screen
authRoutes.get(
  "/add-employees",
  authSecurity.userLoggedIn,
  (req, res, next) => {
    const roles = ["BOSS", "DEVELOPER", "TA"];

    res.render("pages/private/add-employees", { roles: roles });
  }
);

// Render the login screen
authRoutes.get("/login", authSecurity.userAlreadyLogged, (req, res, next) => {
  res.render("pages/login");
});

authRoutes.post(
  "/login",
  passport.authenticate("local-auth", {
    successRedirect: "/",
    failureRedirect: "/login",
    passReqToCallback: true,
    failureFlash: true
  })
);

authRoutes.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
