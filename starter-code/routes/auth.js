const express     = require("express");
const auth  = express.Router();
const passport    = require("passport");
const bcrypt      = require("bcrypt");
const bcryptSalt  = 10;

const User = require("../models/User");

auth.get('/', (req, res, next) => res.render('index'));


auth.get("/signup", (req, res) => res.render("auth/signup"))
auth.post("/signup", (req, res, next) => {
  const {picURL, username, password, bio} = req.body

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({picURL, username, password: hashPass, bio}) 

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/")
      }
    })
  })
  .catch(error => {
    next(error)
  })
});


auth.get("/login", (req, res, next) => {
    res.render("auth/login", { "message": req.flash("error") });
})

auth.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

auth.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
});

module.exports = auth;