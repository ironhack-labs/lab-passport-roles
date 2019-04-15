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

const checkBoss = checkRoles("Boss");

function checkRoles(role) {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.redirect("/privateBoss");
        }
    }
};

Router.post("/login", passport.authenticate("local", {
    successRedirect: "/roles/privateBoss",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

Router.get("/roles/privateBoss", checkBoss, (req, res, next) => {
    User.find()
        .then(users => {
            res.render("users/index", { users });
        })
        .catch(err => {
            console.log('Error while finding all users', err)
            next(err)
        })
})

Router.post("/roles/privateBoss", checkBoss, (req, res, next) => {
    const { username, role, bio } = req.body

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({ username, password: role, bio })

    newUser.save()
        .then(newUser => res.redirect('/users'))
        .catch(error => {
            console.log(`Error saving new users: ${error}`)
            res.render("users/new")
        })
});

Router.get("/new", checkBoss, (req, res, next) => {
    res.render("users/new")
});

Router.post("/:id/delete", checkBoss, (req, res, next) => {

    User.findByIdAndRemove(req.params.id)
        .then(user => {
            console.log("He borrado el user " + user)
            res.redirect("/users")
        })
        .catch(err => {
            console.log('Error while deleting a user', err)
            next(err)
        })
});

Router.post("/:id/edit", checkBoss, (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            res.render("users/edit", { user })
            myOwnProfile = false
            isBoss = false
        })
        .catch(err => {
            console.log('Error while finding a user to edit', err)
            next(err)
            res.redirect('/login')
        })
});

Router.post("/:id/edited", checkBoss, (req, res, next) => {
    const { username, role, bio } = req.body

    User.update({ _id: req.params.id }, { $set: { username, role, bio } })
        .then(user => res.redirect('/users'))
        .catch(err => {
            console.log('Error while updating a user', err)
            next(err)
        })
});

