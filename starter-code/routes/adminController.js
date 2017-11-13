'use strict';

const express = require("express");
const adminController = express.Router();
const passport = require("passport");

adminController.get("/login", (req, res) => {
    res.render("admin/login");
});

adminController.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/admin/login",
    failureFlash: true,
    passReqToCallback: true
}));

module.exports = adminController;
