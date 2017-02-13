/* jshint esversion: 6, node: true */
'use strict';

const express = require("express");
const siteController = express.Router();
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const checkBoss = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');

siteController.get("/", ensureAuthenticated, (req, res, next) => {
    if (req.user.role === 'Boss'){
      return res.render('index', {
        isBoss: true
      });
    }
    res.render("index");
});

siteController.get("/login", (req, res, next) => {
    res.render('login');
});

siteController.post("/login",
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

siteController.get("/admin", checkBoss, (req, res, next) => {
    const deleteUser = req.query.deluser;
    if (deleteUser) {
        console.log("we have a user to delete!");
        User.findByIdAndRemove(deleteUser, (err, doc) => {
            if (err) return next(err);
            res.redirect("/admin");
        });
    } else {
        User.find({}, (err, users) => {
            if (err) return next(err);
            res.render('admin', {
                users
            });
        });
    }

});

siteController.post("/admin", checkBoss, (req, res, next) => {
    const {
        username,
        name,
        familyName,
        role,
        password
    } = req.body;
    if (username === '' || name === '' || familyName === '' || role === '' || password === '') {
        return res.render('/admin', {
            errorMsg: "fields cannot be blank."
        });
    }
    if (role !== 'Boss' && role !== 'Developer' && role !== 'TA') {
        return res.render('/admin', {
            errorMsg: "role has to be one of either [Boss | Developer | TA]"
        });
    }
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return next(err);
        const newUser = User({
            username,
            name,
            familyName,
            role,
            password: hash
        });
        newUser.save((err, user) => {
          if (err) return next(err);
          return res.redirect('/admin');
        });
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function checkRoles(role) {
    return function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.redirect('/login');
        }
    };
}

module.exports = siteController;
