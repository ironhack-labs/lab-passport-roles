const express = require("express");
const router = express.Router();
const passport = require('passport')
const ensureLogin = require("connect-ensure-login");

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/addEmployee", (req, res) => res.render("editContent/addEmployee"));

router.post("/addEmployee", (req, res, next) => {

    const {username,password,role} = req.body

    if (!username || !password||role) {
        res.render("editContent/addEmployee", {
            message: "Introduce un usuario, contraseña y su role"
        });
        return;
    }

    User.findOne({username})

        .then(user => {
            if (user) {
                res.render("editContent/addEmployee", {
                    message: "Ese empleado ya EXISTE, Jefaz@"
                });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({username,password: hashPass,role})
                .then(x => res.redirect("/"))
                .catch(x => res.render("editContent/addEmployee", {
                    message: "Algo fue mal, inténtalo más tarde. Oopsy!"
                }))
        })
        .catch(error => {
            next(error)
        })
});
module.exports = router;