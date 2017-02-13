const express        = require("express");
const siteController = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const flash          = require("connect-flash");



siteController.get("/", (req, res, next) => {

  User.find({}, (error, users)=> {
  if (error) {
    next(error);
  } else {
    console.log(users);
    res.render('index', { user: req.user, users });
  }
})

  // res.render("index", { user: req.user, users });
});



siteController.post("/create-user", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var role     = req.body.role;
  if (username === "" || password === "" || role === "") {
    res.render("/create-user", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("/create-user", { message: "The username already exists" });
      return;
    }
    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);
    var newUser = User({
      username,
      password: hashPass,
      role
    });
    newUser.save((err) => {
      if (err) {
        res.render("create", { message: "The username already exists" });
      } else {
        res.redirect("/");
      }
    });
  });
});

// passport session stuff
siteController.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") }
  );
});

// send login information to route
siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/create-user",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



module.exports = siteController;
