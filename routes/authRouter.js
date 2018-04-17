const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const ensureLoggedOut = require('../middlewares/ensureLoggedOut'); 
const ensureLoggedIn = require('../middlewares/ensureLoggedIn'); 
const isBoss = require('../middlewares/isBoss'); 


// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

 authRoutes.get("/signup",  [ensureLoggedIn('/'), isBoss("/")] , (req, res, next) => {
  res.render("auth/signup");
}); 

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

   let checkEmpty = new Promise((resolve,reject) => {
     if (username === "" || password === "") {
         res.render("auth/signup", { message: "Indicate username and password" });
         reject()
     }
     resolve(username,password)
   })

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    reject();
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) throw new Error("The username already exists");
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username: username,
        password: hashPass,
        });

      return newUser.save();
    })
    .then(newUser => {
      res.redirect("bosspage");
    })
    .catch(e => {
      res.render("auth/signup", { message: e.message });
    });
});

 authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
}); 

authRoutes.get("/bosspage", (req, res, next) => {
    User.find()
    .then(users => {
      console.log(users);
      res.render("auth/bosspage", { users });
    })
    .catch(error => {
      console.log(error);
    });
    
  }); 

  authRoutes.get("/:id/delete", (req, res) => {
    User.findByIdAndRemove(req.params.id)
      .then(() => {
        res.redirect("/auth/bosspage");
      })
      .catch(error => {
        res.render("error");
      });
  });

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/bosspage",
    failureRedirect: "/auth/login",
    failureFlash: false,
    passReqToCallback: false
  })
);

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = authRoutes;
