const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const passport = require("passport")
const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render("auth/login", {
    message: "Restricted area!"
})
const isProfileOwner = (req, res, next) => req.params.id === req.user.id ? true : false
const checkProfileEdition = (req, res, next) => req.isAuthenticated() && req.params.id === req.user.id ? next() : res.redirect("/login")
router.get("/", isLoggedIn, (req, res, next) => {
    User.find({}, {
            username: 1
        })
        .then(allUsers => res.render("profile-list", {
            allUsers
        }))
        .catch(err => console.log("There was an error in the DDBB: ", err))

})
router.get("/:id", isLoggedIn, (req, res) => {
    const isOwner = isProfileOwner(req)
    User.findById(req.params.id)
        .then(user => res.render("private/profile", {
            user,
            isOwner: isOwner
        }))
        .catch(err => console.log("There was an error in the DDBB: ", err))

})
router.get("/:id/edit", isLoggedIn, checkProfileEdition, (req, res) => {
    User.findById(req.params.id)
        .then(user => res.render("private/profile-edition", user))
        .catch(err => console.log("There was an error in the DDBB: ", err))
})

router.post("/:id", isLoggedIn, checkProfileEdition, (req, res) => {
    const {
        skills,
        hobbies
    } = req.body
    User.findByIdAndUpdate(req.params.id, {
            skills,
            hobbies
        }, {
            new: true
        })
        .then((user) => res.redirect(`/profiles/${user.id}`))
        .catch(err => console.log("There was an error in the DDBB: ", err))
})

module.exports = router