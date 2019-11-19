const express = require('express');
const router  = express.Router();
// Require user model
 const User = require('../models/user.models')

 // Add passport 
 const passport = require('passport')
 const ensureLogin = require("connect-ensure-login");

 /* GET home page */
router.get("/", (req, res) => res.render("index"))

 router.get("/login", (req, res) => res.render("login", {
     "message": req.flash("error")
 }));

router.post("/login", passport.authenticate("local", { 
    successRedirect: "/boss",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", {
    roleErrorMessage: `Necesitas ser un ${role} para acceder aquí`
})
const isRole = role => (req, res, next) => req.user && req.user.role === role

router.get('/boss', checkRole("Boss"), (req, res) => res.render('/boss/index', {
    user: req.user
}))

router.get('/ta', checkRole("TA"), (req, res) => res.render('ta/index', {
    user: req.user
}))

router.get('/miscelania-page', (req, res) => res.render('conditional-rendering', {
    isAdmin: isRole('ADMIN')
}))

module.exports = router;