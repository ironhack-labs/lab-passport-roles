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



authRoutes.get('/bosspage',[ensureLoggedIn('/auth/login'),isBoss('/')], (req, res, next) => {
  console.log(req.user.role)
  res.render('auth/bosspage',{user:req.username});
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.get("/list", (req, res, next) => {
  
    User.find()
    .then(user_data => {
      console.log(user_data)
      res.render("auth/list", { user_data });
    })
    .catch(error => { console.log(error) })
 
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

authRoutes.post("/bosspage", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("auth/bosspage", { message: "Indicate username and password" });
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
      res.redirect("/auth/bosspage");
    })
    .catch(e => {
      res.render("auth/signup", { message: e.message });
    });
});

authRoutes.get('/:id/delete', (req, res) => {
  console.log(req.params.id)
  User.findByIdAndRemove(req.params.id)
  .then(() => {
    
    res.redirect("/auth/list");
  })
    .catch(error => {
      console.log(error)
    })
});

authRoutes.get('/:id/edit', (req, res) => {
  User.findById(req.params.id)
  .then((user_data) => {

    res.render("auth/edit", { user_data });
  })
  .catch(error => { console.log(error) })
});

authRoutes.post("/:id/edit", (req, res) => {
  const { username, role } = req.body;
  const updates = { username, role };

  User.findByIdAndUpdate(req.params.id, updates)
  .then(() => {
    res.redirect("/auth/list");
  });
});


module.exports = authRoutes;