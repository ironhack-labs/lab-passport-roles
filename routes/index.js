const express = require('express');
const router  = express.Router();
const passport = require("passport");
const authRoutes = express.Router();
const isBoss = require('../middlewares/isBoss');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  //   let checkEmpty = new Promise((resolve,reject) => {
  //     if (username === "" || password === "") {
  //         res.render("auth/signup", { message: "Indicate username and password" });
  //         reject()
  //     }
  //     resolve(username,password)
  //   })

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    reject();
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) throw new Error("The username already exists");
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });
      return newUser.save();
    })
    .then(newUser => {
      res.redirect("/");
    })
    .catch(e => {
      res.render("passport/signup", { message: e.message });
    });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/boss-page",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: false
  })
);

// router.get('/boss-page',[ensureLoggedIn('/login'),isBoss('/')],(req, res, next) => {
//   console.log(req.user.role)
//   res.render('boss/boss',{user:req.user});
// });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
