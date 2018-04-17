const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");
const isAdmin = require('../middlewares/isAdmin');
const isTA = require('../middlewares/isTA');
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get('/',[isTA('/listuser/login')], (req, res, next) => { /* / --> listuser   */
  User.find().then(user => {
    //console.log({user})
    res.render('users/users_list', {user});
  })
});

router.get('/:id/delete',[ensureLoggedIn('/listuser/login'), isAdmin('/listuser/boss')], (req, res) => { /* / --> listuser   */
  User.findByIdAndRemove(req.params.id).then(user => {
    // console.log()
    res.redirect('/listuser');
  })
});

router.get("/boss", (req, res) =>{
  res.render("users/boss");
})
///////-----------login--------------//////

router.get("/login", (req, res, next) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/listuser",
    failureRedirect: "/listuser/login",
    failureFlash: false,
    passReqToCallback: false
  })
);


///////-----------sign--------------//////

router.get("/signup", [isAdmin('/listuser/boss')], (req, res, next) => {
  res.render("users/signup");
});

router.post("/signup", (req, res) => {
  let { username, password } = req.body;
  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("users/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = User({
      username,
      password: hashPass
    });
    newUser.save(err => {
      res.redirect("/listuser");
    });
  });
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
