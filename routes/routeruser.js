const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
// const checkBoss  = checkRoles('Boss');
// const checkEditor = checkRoles('ta');
// const checkAdmin  = checkRoles('Developer');




authRoutes.get("/signup", (req, res, next) => {
  res.render("login/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("login/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("login/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("login/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});


authRoutes.get("/login", (req, res, next) => {
  res.render("login/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}));

authRoutes.get("/private/:id", (req,res) => {
  
  User.findOne({_id: req.params.id})
  .then( user => {
    res.render("login/profile", user)
  })
})

authRoutes.get("/private", checkRoles("Boss"), (req, res, next) => {
  User.find()
    .then(users => {
      res.render("login/bossForm", {users});
    })
    .catch(err => {
      console.log(err);
    });
});




function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


authRoutes.get("/private/delete/:id", (req,res) => {
  User.findByIdAndRemove(req.params.id), () => {
    res.redirect("/private")
  }
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


 module.exports = authRoutes;