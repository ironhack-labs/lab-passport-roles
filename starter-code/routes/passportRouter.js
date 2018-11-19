const express        = require("express");
const passportRouter = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const passport       = require("passport");
const ensureLogin    = require("connect-ensure-login");

const bcryptSalt = 10;

passportRouter.get("/privateall", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/privateall", { user: req.user });
});

passportRouter.get("/privateboss", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/privateboss", { user: req.user });
});

passportRouter.get("/privatebossta", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/privatebossta", { user: req.user });
});

passportRouter.get("/signup", (req, res, next) => {
  res.render('passport/signup');
})

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const rol = req.body.rol;

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
      password: hashPass,
      rol
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
        console.log("createddddddddd")
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

passportRouter.get("/login", (req, res, next) => {
  res.render('passport/login');
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/privateall",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));





module.exports = passportRouter;