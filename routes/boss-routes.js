const express = require('express');
const router  = express.Router();
const authRoutes = express.Router();

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User");

router.get('/', (req, res, next) => {
    console.log(req.user.role)
    res.render('boss/boss',{user:req.user});
});

router.get("/show", (req, res, next) => {
  User.find()
  .then( users_details => {
    res.render("boss/show", {users_details});
  })
});

router.get("/add", (req, res, next) => {
  res.render("boss/add");
});

router.post("/add", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

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
      res.redirect("/boss-page/show");
    })
    .catch(e => {
      res.render("error", { message: e.message });
    });
});

router.post("/show/:id/delete", (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
  .then(res.redirect("/boss-page/show"))
  .catch(err => res.render("error", err));
})
  

module.exports = router;