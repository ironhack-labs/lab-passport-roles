    require('dotenv').config();

const express = require("express");
const Router = express.Router();
const session = require("express-session");
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const flash = require("connect-flash");

Router.get("/signup", (req, res, next) => {
    res.render("roles/signup");
});

Router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("roles/signup", { message: "Indicate username and password" });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (user !== null) {
                res.render("roles/signup", { message: "The username already exists" });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({
                username,
                password: hashPass
            })
                .then(() => res.redirect("/"))
                .catch(() => res.redirect("/"));
        });
});

Router.get("/login", (req, res, next) => {
    res.render("roles/login", { message: req.flash("error") });
});

Router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

// Router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("roles/private", { user: req.user });
// });

module.exports = Router;