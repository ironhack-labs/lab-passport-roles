const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const checkRoles = require("../middlewares/checkRoles")

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", checkRoles("BOSS"), (req, res, next) => {
  res.render('signup');
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/list", (req, res, next) => {
  User.find()
  .then (users => {
    res.render ("list", {users})
  })
  .catch (err => {
    next(err)
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.post("/signup", (req, res, next) => {
  const {username, password, role} = req.body;
  if (username === "" || password === "" || role === "") {
    res.render("signup", { message: "Indicate username, password and role" });
    return;
  };
  User.findOne({username})
  .then (user => {
    if (user !== null) {
    res.render("signup", { message: "The username already exists" });
    return;
  }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User ({
      username,
      password: hashPass,
      role
    });
    newUser.save((err) => {
      if (err) {
        res.render("signup", {message: "Something went wrong"});
      } else {
        res.redirect("/signup");
      }
    });
  })
  .catch(error => next(error));
});

router.get ("/list/:id", (req, res, next) => {
  let userId = req.params.id;
  User.findById(userId)
  .then (user => {
    res.render("show", {user})
  })
  .catch (err => {
    next(err)
  });
});

router.post ("/list/:id/delete", (req, res, next) => { 
  let userId = req.params.id;
  User.findByIdAndRemove(userId)
    .then (() => {
      res.redirect("/list")
    })
    .catch(err => {
      next(err)
    });
});

module.exports = router;
