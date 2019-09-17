const express = require("express");
const userRouter = express.Router();
const passport = require('passport');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const secure = require("../middlewares/secure.mid");


// Require user model
userRouter.get("/signup", (req, res, next) => {
  res.render("users/signup");
});

userRouter.post("/signup", (req, res, next) => {
  const { username, password, role } = req.body;

  if (username === "" || password === "") {
    res.render("users/signup", { message: "You must fill both fields." });
    return;
  }

  User.findOne({ username }).then(userFound => {
    if (userFound) {
      res.render("users/signup", { message: "This user already exists." });
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashPass, role })
      .then(userCreated => {
        res.redirect("/")
      })
      .catch(error => next(error))
  });
});

userRouter.get("/login", (req, res, next) => {
  res.render("users/login");
});

userRouter.post("/login", passport.authenticate("local-auth", {
  successRedirect: "/",
  failureRedirect: "/login",
  passReqToCallback: true,
  failureFlash: true
}));

userRouter.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
})

module.exports = userRouter;
