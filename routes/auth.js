const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function checkRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next()
    }
    else {
      res.redirect('/')
    }
  }
}

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", checkRole("BOSS"), (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", checkRole("BOSS"), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role: role,
    });

    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// router.get('/facebook', passport.authenticate('facebook'));

// router.get('/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/' }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     const username = req.body.username;
//     const password = req.body.password;
//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);
//     const newUser = new User({
//       username,
//       password: hashPass,
//       role: "STUDENT",
//     });
//     newUser.save()
//       .then(() => {
//         res.redirect("/");
//       })
//       .catch(err => {
//         res.render("auth/signup", { message: "Something went wrong" });
//       })
//   }
// );

router.get('/google/login',
  passport.authenticate('google'),
  function (req, res) {
    // The request will be redirected to Google for authentication, so
    // this function will not be called.
  });

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
