const express = require("express");
const siteController = express.Router();
const passport = require("passport");
const checkRoles = require("../middlewares/checkroles")
const actualUser = require("../middlewares/actualuser")
const bcrypt = require("bcrypt");
const User = require("../models/User");
const bcryptSalt = 10;

siteController.get("/", (req, res, next) => {
  res.render("auth/login");
});

siteController.post("/", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/",
}));

siteController.get('/private', (req, res) => {
  res.render('private', { user: req.user });
});

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

siteController.get("/boss", checkRoles('Boss'), (req, res) => {
  User.find().exec((err, users) => {
    res.render("boss", { users })
  })

})

siteController.post("/boss", checkRoles('Boss'), (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("boss", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("boss", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      name,
      familyName,
      password: hashPass,
      role
    });
    newUser.save((err) => {
      if (err) {
        res.render("/private", { message: "Something went wrong" });
      } else {
        res.redirect("/boss");
      }
    });
  });
});

siteController.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id, (err, user) => {
    if (err) {
      return next(err)
    }
    return res.redirect("/boss");
  })
});

siteController.get("/profile/:id", (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) {
      return next(err)
    }

    User.find().exec((err, users)=> {
      return res.render("profile", {user, users})
    })
    // return res.render("profile", { user })
  })
})

siteController.get("/profile/edit/:id", actualUser, (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) {
      return next(err)
    }

    User.find().exec((err, users)=> {
      return res.render("editprofile", {user, users})
    })
    // return res.render("profile", { user })
  })
})

siteController.post("/profile/edit/:id", (req, res) => {
  let id = req.params.id;
  let username = req.body.username;
  let name = req.body.name;
  let familyName = req.body.familyName;
  let updates ={
    username,
    name,
    familyName
  };
  console.log(updates)
  User.findByIdAndUpdate(id, updates, (err, user) => {
    if (err) {
      res.render(`/profile/${id}`, { message: "Something went wrong" });
    } else {
      res.redirect(`/private`);
    }
  });
});


module.exports = siteController;
