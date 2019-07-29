const express = require('express');
const router  = express.Router();
const authRoutes = express.Router();

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10




authRoutes.get("/new-user", (req, res, next) => res.render("new-user"))

authRoutes.post("/new-user", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("new-user", { message: "Rellena todo" });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("new-user", { message: "El usuario ya existe" });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                username,
                password: hashPass
            });

            newUser.save((err) => {
                if (err) {
                    res.render("new-user", { message: "Something went wrong" });
                } else {
                    res.redirect("/");
                }
            });

        })
        .catch(error => {
            next(error)
        })
});


module.exports = authRoutes;