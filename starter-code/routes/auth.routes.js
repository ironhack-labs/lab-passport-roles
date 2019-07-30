
const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login") // Asegurar la sesión para acceso a rutas

const authRoutes = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10



// // RUTA PARA EL LOGIN/////////////////////////////////////////

// metodo get para renderizar la pagina signup 
authRoutes.get("/signup", (req, res, next) => res.render("signup"))


//metodo post para enviar los datos del usuario registrados sin que se vean
// en el navegador
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
                    res.render("auth/signup", { message: "Algo ha fallado" });
                } else {
                    res.redirect("/");
                }
            });

        })
        .catch(error => {
            next(error)
        })
})



//////////////////   creamos el LOGIN ///////////////////////////////////////////////////////


// metodo get para que el servidor nos devuelva y nos dibuje la pagina del login
authRoutes.get("/login", (req, res, next) => {
    res.render("login", { "message": req.flash("error") });
})



// metodo post para pasar a la base de  los datos del usuario y compararlos con los que ya tiene
//cuando se registro

//local es la estrategia, en este caso conectarse con un usuario, hay otras como registrarse por email, o con Face

authRoutes.post("/login", passport.authenticate("local", {
    // si todo esta bien se va a la pagina principal
    successRedirect: "/",
    //si falla algo vuelve a cargar la pagina del login
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));



// metdodo para cerrar sesión
authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});



module.exports = authRoutes