const express = require('express');
const router  = express.Router();
const authRoutes = express.Router();

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10




authRoutes.get("/signup", (req, res, next) => res.render("signup"))

authRoutes.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("signup", { message: "Rellena todo" });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render("signup", { message: "El usuario ya existe" });
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
                    res.render("signup", { message: "Something went wrong" });
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