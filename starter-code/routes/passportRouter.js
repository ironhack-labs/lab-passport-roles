const express = require("express");
const passportRouter = express.Router();

const User = require("../models/user");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role= req.body.role;
  console.log(req.body.role)

  if (username === "" || password === "") {
    console.log("ENTRO");
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          message: "The username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      newUser.save(err => {
        if (err) {
        console.log(err)
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("login");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});


passportRouter.get("/login", (req,res)=>{
    res.render("passport/login");
  })

  

passportRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }));



passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
    console.log(req.body)
    res.render("passport/private", { user: req.user });
  });

module.exports = passportRouter;
