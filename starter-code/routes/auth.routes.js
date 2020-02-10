const express = require("express")
const router = express.Router()

const passport = require("passport");


// // Registro
// router.get("/signup", (req, res) => res.render("auth/signup"))

// router.post("/signup", (req, res) => {

//     const { username, password } = req.body

//     if (username === "" || password === "") {
//         res.render("auth/signup", { message: "Rellena los campos" })
//         return
//     }

//     Empl.findOne({ username })
//         .then(user => {
//             if (user) {
//                 res.render("auth/signup", { message: "El usuario ya existe" })
//                 return
//             }

//             const salt = bcrypt.genSaltSync(bcryptSalt)
//             const hashPass = bcrypt.hashSync(password, salt)

//             Empl.create({ username, password: hashPass })
//                 .then(() => res.redirect('/'))
//                 .catch(() => res.render("auth/signup", { message: "Something went wrong" }))
//         })
//         .catch(error => next(error))
// })



router.get("/login", (req, res) => res.render("auth/login", { message: req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router