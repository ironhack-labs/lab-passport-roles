const passport = require("passport");

const express = require("express");

const bcrypt = require("bcrypt");

const User = require("../models/user-model");

const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form");
});

router.post("/process-signup", (req, res, next) => {
  const { fullName, email, password } = req.body;
  //password can't be blank and requires a number
  if (password === "" || password.match(/[0-9]/) === null) {
    //flash code
    //req.flash is defined by the "flash" package
    //req.flash("error", "Yout password must have at least a number.");
    res.redirect("/signup");
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  User.create({ fullName, email, encryptedPassword })
    .then(() => {
      //flash code
      //req.flash is defined by the "flash" package
      //req.flash("success", "You have signup ! Try logging in.");
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
  // res.send({
  //   password,
  //   salt,
  //   encryptedPassword,
  //   check: bcrypt.compareSync(password, encryptedPassword),
  //   badCheck: bcrypt.compareSync("blah", encryptedPassword)
  // });
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form");
});

router.post("/process-login", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(userDetails => {
      //"userDetails" will be falsy if we didn't find a user
      if (!userDetails) {
        //req.flash is defined by the flash package
        //req.flash("error", "Wrong email.");
        res.redirect("/login");
        return;
      }
      const { encryptedPassword } = userDetails;
      //const encryptedPassword = userDerails.encryptedPassword;
      if (!bcrypt.compareSync(password, encryptedPassword)) {
        //req.flash is defined by the flash package
        //req.flash("error", "Wrong password.");
        res.redirect("/login");
        return;
      }
      //req.session.isLoggedIn = true;
      //req.login() is Passport 's method for logging a user in
      req.login(userDetails, () => {
        //req.flash is defined by the flash package
        //req.flash("success", "Log in successful!");
        res.redirect("/");
      });
    })
    .catch(err => {
      next(err);
    });

  //res.send(req.body);
});

router.get("/logout", (req, res, next) => {
  //req.session.isLoggedIn = false
  //req.logout() is Passport's method for logging a user OUT
  //req.flash is defined by the flash package
  //req.flash("success", "Log out was successful!");
  req.logout();
  res.redirect("/");
});

module.exports = router;
