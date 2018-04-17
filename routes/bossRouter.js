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

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  const newUser = {
    username: req.body.username,
    password: hashPass,
    role: req.body.user_type
  }

  User.create(newUser)
    .then( () => {
      console.log(`${newUser.username} created!`)
      res.redirect("/passport/bossPage");
    })
    .catch( err => console.log(err))
})

/* DELETE USER */
router.post("/delete", (req, res, next) => {
  User.findOneAndRemove({username: req.body.userSelect})
    .then( () => res.redirect("/passport/bossPage"))
    .catch( err => console.log(err))
})

module.exports = router;