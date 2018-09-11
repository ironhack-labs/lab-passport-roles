const passport = require("passport");
const express = require("express");
const authRoutes = express.Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");


authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = authRoutes;