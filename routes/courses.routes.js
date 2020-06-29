const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const passport = require("passport")
//Role checker 
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render("auth/login", {
    message: "Restricted area!"
})
//Login checker 
const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render("auth/login", {
    message: "Restricted area!"
})

router.get("/", isLoggedIn, checkRole(["TA"]), (req, res, next) => {
    res.render("courses")
})

router.get("/create", isLoggedIn, checkRole(["TA"]), (req, res, next) => {
    res.render("courses/create")
})





module.exports = router