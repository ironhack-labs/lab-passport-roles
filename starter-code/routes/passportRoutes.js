const express = require("express");
const passportRouter = express.Router();
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt")
const bcryptSalt = 10


// Metodo Login con GET
app.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") })
})
// Método Login con POST
app.post('/login', passport.authenticate("local", {
  successRedirect: "/employees",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))




//Route para el passport
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
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
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});


// Add passport 

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;