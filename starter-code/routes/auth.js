const express = require("express");
const router = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require('passport');


// Ruta Index
router.get("/", (req, res, next) => {
  res.render("index", {user: req.user})
});

//Ruta Login
router.get("/login", (req, res, next) => {
  res.render("../views/login.ejs");
});

//Ruta Registro
router.get("/signup", (req, res, next) => {
  res.render("../views/signup.ejs");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const familyName = req.body.familyName;


  if (username === "" || password === "") {
    res.render("../views/signup.ejs", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("../views/signup.ejs", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      name,
      familyName
    })
    .save()
    .then(user => res.redirect('/'))
    .catch(e => res.render("../views/signup.ejs", { message: "Something went wrong" }));

  });
});

router.get('/login',(req,res) =>{
  res.render('../views/login.ejs',{ message: req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/logout',(req,res) =>{
  req.logout();
  res.redirect("/");
});
module.exports = router;
