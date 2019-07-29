const express = require('express');
// const router  = express.Router();
const authRoutes = express.Router();
const passport = require('passport');

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10

// para poder restringir el acceso según rol

const checkRoles = (role) => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { msg: `Necesitas ser un ${role} para acceder aquí` })


authRoutes.get("/new-user", checkRoles("BOSS") ,(req, res, next) => res.render("new-user"))

authRoutes.post("/new-user", checkRoles("BOSS"), (req, res, next) => {

    const { username, password, role } = req.body

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
                password: hashPass,
                role
            });

            newUser.save((err) => {
                if (err) {
                    res.render("new-user", { message: "Something went wrong" });
                } else {
                  console.log('usuario creado')
                    res.redirect("/");
                }
            });

        })
        .catch(error => {
            next(error)
        })
});


authRoutes.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") });
})

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



module.exports = authRoutes;