const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login") // Asegurar la sesión para acceso a rutas
const Handlebars = require('handlebars')
const Swag = require('swag')
const router = express.Router();

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10

router.get("/signup", (req, res, next) => res.render("alumni-signup"))
router.post("/signup", (req, res, next) => {

    const { username, password, role} = req.body

    if (username === "" || password === "") {
        res.render("signup", { message: "Rellena todos los campos" });
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

            User.create({username, password: hashPass, role})
            .then(()=> res.redirect("/user"))
            .catch( err => console.log("Hubo un error: ", err))

          })
          .catch(error => {
          next(error)
        })
});

module.exports = router