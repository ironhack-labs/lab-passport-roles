const express = require("express");
const router = express.Router();

const Users = require('../models/user')


router.get("/", (req, res, next) => {
    Users.find()
        .then(celebrities => {
            res.render("celebrities/index", { celebrities });
        })
        .catch(err => {
            console.log('Error while finding all celebrities', err)
            next()
        })
})

router.post("/", (req, res, next) => {
    const { name, occupation, catchPhrase } = req.body
    const newUsers = new User({ name, occupation, catchPhrase })

    newUsers.save()
        .then(newCelebrity => res.redirect('/celebrities'))
        .catch(error => {
            console.log(`Error saving new celebrity: ${error}`)
            res.render("users/new")
            next()
        })
})