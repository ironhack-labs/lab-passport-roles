const passport = require("passport");
const express = require("express");
const authRoutes = express.Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");


authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login");
});

authRoutes.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
}));

module.exports = authRoutes;