const express = require("express");
const router = express.Router();
const passport = require('passport')
const ensureLogin = require("connect-ensure-login");

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res) => res.render("auth/login", {
    "message": req.flash("error")
}));

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

module.exports = router;