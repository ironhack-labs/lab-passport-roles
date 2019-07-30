const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login") // Asegurar la sesión para acceso a rutas
const Handlebars = require('handlebars')
const Swag = require('swag')
const router = express.Router();

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10


Swag.registerHelpers(Handlebars)
// router.get('/list', (req, res, next) => {
//   User.find({})
//   .then(users => res.render('users-index', {users}))
//   .catch(err => console.log('Hubo un error:', err))
// })

router.get("/signup", (req, res, next) => res.render("signup"))
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


router.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") });
})


router.post("/login", passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


//router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => res.render("private", { user: req.user }))
module.exports = router