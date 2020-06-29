const express = require("express");
const router = express.Router();
const passport = require("passport");
//const ensureLogin = require("connect-ensure-login");

// add routes here
const User = require("./../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//GET SingUp
router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res) => {
    const {
        username,
        password
    } = req.body;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    //console.log('---------------', username, hashPass)

    User.create({
            username,
            password: hashPass,
        })
        .then((theUserCreated) => {
            console.log("Se ha creado el usuario registrado", theUserCreated);
            res.redirect("/signup");
        })
        .catch((err) => console.log("Error", err));
});

router.get("/login", (req, res, next) => {
    res.render("auth/login", {
        message: req.flash("error"),
    });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
}));

// Logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});



module.exports = router;