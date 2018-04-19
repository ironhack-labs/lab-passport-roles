const express = require("express");
const router = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* CREATE NEW USER */
router.get("/create", (req, res, next) => {
  res.render("boss/create");
})

router.post("/create", (req, res, next) => {

  const newUser = { username: req.body.username, password: hashPass, role: req.body.user_type };

  if(newUser.username === "" || newUser.password === "") {
    res.render("boss/create", {errorMessage: "Username or password are empty"})
    return;
  }

  User.findOne({username}, "username", (err, user) => {
    if(user !== null) {
      res.render("boss/create", {errorMessage: "The user already exists"})
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(req.body.password, salt);

    User.create(newUser)
      .then(() => {
        console.log(`${newUser.username} created!`);
        res.redirect("/passport/bossPage");
      })
      .catch(err => console.log(err));
  })
})

/* DELETE USER */
router.post("/delete", (req, res, next) => {
  User.findOneAndRemove({username: req.body.userSelect})
    .then( () => res.redirect("/passport/bossPage"))
    .catch( err => console.log(err))
})

module.exports = router;