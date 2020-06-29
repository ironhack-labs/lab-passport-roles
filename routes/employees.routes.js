const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const User = require("../models/User.model")
const passport = require("passport")
//Role Checker
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render("auth/login", {
    message: "Restricted area!"
})


// add routes here
router.get("/", checkRole(["BOSS"]), (req, res, next) => {
    User.find({}, {
            username: 1
        })
        .then(allUsers => res.render("employees-list", {
            allUsers
        }))
})
router.get("/create-user", checkRole(["BOSS"]), (req, res, next) => res.render("auth/createUser"))
router.post("/create-user", (req, res, next) => {
    const {
        username,
        password,
        role
    } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/createUser", {
            errorMsg: "Fill in the fields"
        });
        return
    }

    User
        .findOne({
            username
        })
        .then(user => {
            if (user) {
                res.render("auth/createUser", {
                    errorMsg: "That username is not available"
                });
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            return User.create({
                username,
                password: hashPass,
                role
            })
        })
        .then(userCreated => userCreated ? res.redirect('/employees') : null)
        .catch(err => console.log("Error!:", err))

})
router.post("/delete/:id", checkRole(["BOSS"]), (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
        .then(res.redirect("/employees"))
        .catch(err => console.log("There was an error in the DDBB: ", err))
})



module.exports = router;