const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const Course = require("../models/Course.model")
const passport = require("passport")
//Role checker 
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render("auth/login", {
    message: "Restricted area!"
})
//Login checker 
const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render("auth/login", {
    message: "Restricted area!"
})
//Username checkers
const userNameChecker = (req, rolenam) => {
    const formNames = req.body[rolenam].split(",")
    User.find({
            role: rolenam
        }, {
            username: 1
        })
        .then(users => formNames.every(name => users.includes(name))
            .then(console.log("HEHEE")))
}

router.get("/", isLoggedIn, checkRole(["TA"]), (req, res, next) => {
    res.render("courses")
})

router.get("/create", isLoggedIn, checkRole(["TA"]), (req, res, next) => {
    res.render("courses/create")
})

router.post("/create", isLoggedIn, checkRole(["TA"]), (req, res, next) => {
    // const developerArray = []
    // const TaArray = []
    // const studentsArray = []
    // req.body.DEV.split(",").forEach(username => User.find({
    //         username,
    //         role: "DEV"
    //     })
    //     .then(user => user ? developerArray.push(user.id) : null)
    //     .catch(err => "there was an error in DDBB: ", err)
    // )
    // req.body.TA.split(",").forEach(username => User.find({
    //         username,
    //         role: "TA"
    //     })
    //     .then(user => user ? TaArray.push(user.id) : null)
    //     .catch(err => "there was an error in DDBB: ", err)
    // )
    // req.body.STUDENT.split(",").forEach(username => User.find({
    //         username,
    //         role: "STUDENT"
    //     })
    //     .then(user => user ? studentsArray.push(user.id) : null)
    //     .catch(err => "there was an error in DDBB: ", err)
    // )

    // Course.create({
    // })
    res.send("Creating")
})







module.exports = router