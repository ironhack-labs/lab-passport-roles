const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("connect-flash");

const User = require("../models/User");

router.get("/", (req, res, next) => {
    res.render("sign-up");
});

router.post("/sign-up", (req, res, next) => {
    const { username, password } = req.body;

    const encrypted = bcrypt.hashSync(password, 10);

    new User({ username, password: encrypted })
        .save()
        .then(result => {
            res.send("User account was created");
        })
        .catch(err => {
            if (err.code === 11000) {
                return res.render("sign-up", { error: "user exists already" });
            }
            console.error(err);
            res.send("something went wrong");
        });
});

router.get("/log-in", (req, res, next) => {
    res.render("log-in", { error: req.flash("error") });
});

router.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/employee/employee-list",
        failureRedirect: "/auth/log-in",
        failureFlash: true
    })
);

module.exports = router;
