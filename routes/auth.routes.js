const express = require('express');
const router = express.Router();
const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// add routes here

router.get("/registro", (req, res) => res.render("auth/registro"))
router.post("/registro", (req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/registro", { errorMsg: "Rellena los campos, ¡vago!" });
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/registro", { errorMsg: "Usuario ya existente" });
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            return User.create({ username, password: hashPass })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log("Error!:", err))
        .catch(err => console.log("Error!:", err))
})

// Login
router.get('/login', (req, res) => res.render('auth/login', { "message": req.flash("error") }))

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))



module.exports = router;
