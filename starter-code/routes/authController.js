'use strict';

const express = require("express");
const authController = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const userController = require('../controllers/userController');
const checkBoss = userController.checkRoles('Boss');

// --- GET Show the sign up employee form --- //
authController.get("/add-employee", checkBoss, (req, res) => {
    res.render("employee/signup");
});

// --- GET Show the login employee form --- //
authController.get("/employee/login", (req, res) => {
    res.render("employee/login");
});

// --- GET Show employee list + Delete button --- //
authController.get("/employee/show", checkBoss, (req, res, next) => {
    User.find({
        role: 'Developer'
    }, (err, doc) => {
        if (err) {
            return next(err);
        }
        const data = {
            users: doc
        };
        res.render("employee/show", data);
    });
});

// --- POST Add new employee --- //
authController.post("/add-employee", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = 'Developer';

    if (username === "" || password === "") {
        res.render("employee/signup", {
            message: "Indicate username and password"
        });
        return;
    }

    User.findOne({
        username
    }, "username", (err, user) => {
        if (user !== null) {
            res.render("employee/signup", {
                message: "The username already exists"
            });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hashPass,
            role
        });

        newUser.save((err) => {
            if (err) {
                res.render("employee/signup", {
                    message: "Something went wrong"
                });
            } else {
                res.redirect("/");
            }
        });
    });
});

// --- POST Login employee --- //
authController.post("/employee/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/employee/login",
    failureFlash: true,
    passReqToCallback: true
}));

// --- POST Delete employee --- //
authController.post('/employee/:id/delete', checkBoss, (req, res, next) => {
    let userId = req.params.id;

    User.findByIdAndRemove(userId, (err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = authController;
