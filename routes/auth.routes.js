const express = require("express")
const router = express.Router()
const passport = require('passport')

const User = require("./../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// SIGN UP

router.get("/registro", (req, res) => res.render("auth/signup"))
router.post("/registro", (req, res) => {

    const {
        username,
        password
    } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", {
            errorMsg: "¡Se te ha olvidado rellenar los campos!"
        });
        return
    }

    User
        .findOne({
            username
        })
        .then(user => {
            if (user) {
                res.render("auth/signup", {
                    errorMsg: "Inventate otro nombre."
                });
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            return User.create({
                username,
                password: hashPass
            })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log("Error!:", err))
        .catch(err => console.log("Error!:", err))
})

// LOG IN

router.get('/login', (req, res) => res.render('auth/login', {
    "message": req.flash("error")
}))

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

// LOG OUT


router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

//AREA PRIVADA

// router.use((req, res, next) => {
//     if (req.session.currentUser) {
//         next()
//     } else {
//         res.render("auth/login", {
//             errorMsg: 'Área restringida! >_<'
//         })
//     }
// })
// router.get("/perfil", (req, res) => {
//     res.render('private/profile', req.session.currentUser)
// });




// ALL USER DATA

// router.get("/lista", (req, res) => {
//     res.send("asjnfajkdjvajlndvlnadvlnad")
    // User.find()
    //     .then(allUsers => res.render('private-list', {
    //         allUsers
    //     }))
    //     .catch(err => console.log("error en la BBDD", err))
// })



module.exports = router