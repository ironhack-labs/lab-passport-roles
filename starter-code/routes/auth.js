const express = require("express");
const authController = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

function checkRoles(role) {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.redirect('/login');
        }
    };
}

const checkBoss = checkRoles('Boss');
const checkDev = checkRoles('Developer');
const checkTA = checkRoles('TA');


authController.get("/login", (req, res, next) => {
    res.render("login");
});

authController.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

authController.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});

authController.get("/profile", ensureLogin.ensureLoggedIn(), (req, res, next) => {
    res.render("profile", {
        user: req.user
    });
});

authController.get("/newUser", checkBoss, (req, res) => {
    res.render("manage/newUser");
});

authController.post("/newUser", checkBoss, (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("manage/newUser", {
            message: "Indicate username and password"
        });
        return;
    }

    User.findOne({
        username
    }, "username", (err, user) => {
        if (user !== null) {
            res.render("manage/newUser", {
                message: "The username already exists"
            });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            name: req.body.name,
            familyName: req.body.familyName,
            password: hashPass,
            role: req.body.role
        });

        newUser.save((err) => {
            if (err) {
                res.render("manage/newUser", {
                    message: "Something went wrong"
                });
            } else {
                return res.redirect('/');
            }
        });
    });
});

authController.get('/setupUsers', checkBoss, (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) {
            return next(err);
        }

        res.render('manage/setupUsers', {
            users: users
        });
    });
});

authController.post('/setupUsers/:id/delete', checkBoss, (req, res, next) => {
    const id = req.params.id;

    User.findByIdAndRemove(id, (err, user) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/');
    });

});
module.exports = authController;