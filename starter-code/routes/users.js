/*jshint esversion: 6 */

const express = require("express");
const Router = express.Router();
const User = require('../models/User')

function checkRoles(roles) {
    console.log(roles)
    return function(req, res, next) {
        roles.map(role => {
            //console.log(role)
            if (req.isAuthenticated() && req.user.role === role) { return next(); } else { res.redirect('/login') }
        })
    }
}

const checkTA = checkRoles(['TA']);
const checkDev = checkRoles(['Developer']);
const checkBoss = checkRoles(['Boss']);
const checkEmployees = checkRoles(['TA', 'Developer'])
const checkUser = checkRoles(['TA', 'Developer', 'Boss'])

// Listado de users
Router.get("/", checkUser, (req, res, next) => {
    User.find()
        .then(user => res.render("users", { user }))
        .catch(err => next(err))
})

Router.get('/new', checkBoss, (req, res) => res.render("users/new"))
Router.post('/new', (req, res, next) => {
    console.log(req.body)
    const { username, password, role } = req.body
    const user = new User({ username, password, role })
    user.save()
        .then(user => res.redirect("/users"))
        .catch(err => next(err))
})

Router.get("/:id", (req, res, next) => {
    User.findById(req.params.id)
        .then(user => res.render("users/show", { user }))
        .catch(err => next(err))
})

Router.post("/:id/delete", checkBoss, (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
        .then(user => res.redirect("/users"))
        .catch(err => next(err))
})

Router.get("/:id/edit", (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => res.render("users/edit", { user }))
        .catch(err => next(err))
})
Router.post("/:id/edit", (req, res, next) => {
    console.log(req.body)
    const { username, password, role } = req.body

    User.update({ _id: req.params.id }, { $set: { username, password, role } })
        .then(celebrity => res.redirect("/users"))
        .catch(err => next(err))
})

module.exports = Router