const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
const flash = require("connect-flash");
const bcryptSalt = 10;


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


passportRouter.get("/signup", (req, res, next) => {
  res.render('passport/signup');
})

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;


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
      role
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

passportRouter.get("/login", (req, res, next) => {
  res.render('passport/login');
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get('/private-page2', checkRoles('Boss'), (req, res) => {
  User.find({})
  .then(users => {
    res.render('passport/private2', {users: users});
  })
  .catch(err => {});
});

passportRouter.get("/delete/:id", (req, res, next) => {
  User.deleteOne({_id: req.params.id})
    .then(() => {
      res.redirect("/private-page2", {user: user});
    })
    .catch(err => {});
});

passportRouter.get('/private-page1', checkRoles('TA','Boss'), (req, res) => {
  res.render('passport/private1', {user: req.user});
});

function checkRoles(role1, role2) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role1 || req.user.role === role2) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}




module.exports = passportRouter;