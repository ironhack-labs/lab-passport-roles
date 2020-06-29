const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const app = require("../app");
const bcryptSalt = 10;

// Signup
router.get("/signup", (req, res) => res.render("auth/signup"));
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (username.length === 0 || password.length === 0) {
    res.render("auth/signup", { errorMsg: "Rellena los campos, por favor" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render("auth/signup", { errorMsg: "Usuario ya existente" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      return User.create({ username, password: hashPass });
    })
    .then(() => res.redirect("/"))
    .catch((err) => console.log("Error!:", err))
    .catch((err) => console.log("Error!:", err));
});

//login

router.get('/login', (req, res) => res.render('auth/login', { "message": req.flash("error") }))

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

// router.get("/login", (req, res, next) => {
//   res.render("auth/login", { message: req.flash("error") });
// });

// // Logout
// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

router.get('/create', (req, res) => {
  res.render('profile/boss')
})

router.post('/create', (req, res) => {

  const { name, password } = req.body

  User
    .create({ name, password })
    .then(() => res.redirect('/profile/'))
    .catch(err => console.log("Error en la BBDD", err))
})

router.post('/:Id/eliminar', (req, res) => {

  User
    .findByIdAndRemove(req.params.Id)
    .then(() => res.redirect('/profile/boss'))
    .catch(err => console.log("Error en la BBDD", err))

})

module.exports = router;
