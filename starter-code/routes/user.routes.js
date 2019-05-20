const express = require("express");
const router = express.Router();

const User = require("../models/User.model")
const passport = require("passport")
const bcrypt = require("bcrypt");

const bcryptSalt = 10;

router.get("/signUp", (req, res) => res.render("user/signUp"));

router.post("/signUp", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("user/signUp", { errmsg: "campos no rellenados" });
    return;
  }
  User.findOne({ username }).then(foundUser => {
    if (foundUser) {
      res.render("user/signUp", { errmsg: "Usuario ya existente" });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashpass = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashpass, role: "Boss"})
      .then(user => {
        console.log(user);
        res.redirect("/");
      })
      .catch(err => console.log(err));
  });
});


router.get("/login", (req, res, next) => {
  res.render("user/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
    passReqToCallback: true
  })
);







module.exports = router;