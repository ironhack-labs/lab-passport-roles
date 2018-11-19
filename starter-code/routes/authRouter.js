//Require
const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const ensureLoggedOut = require('../middlewares/ensureLoggedOut');

//Modelo usuario
const User = require("../model/user");

//Encriptado de password
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", ensureLoggedOut('/specialpage'), (req, res, next) => {
    res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/signup", { message: "Indicate username and password" });
        reject();
    }

    User.findOne({ username })
        .then(user => {
            if (user !== null) throw new Error("The username already exists");
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                username,
                password: hashPass
            });
            return newUser.save();
        })
        .then(newUser => {
            res.redirect("/");
        })
        .catch(e => {
            res.render("auth/signup", { message: e.message });
        });
});

authRoutes.get("/login", ensureLoggedOut("/"), (req, res, next) => {
    res.render("auth/login");
});

authRoutes.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login",
        failureFlash: false,
        passReqToCallback: false
    })
);

authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


module.exports = authRoutes;