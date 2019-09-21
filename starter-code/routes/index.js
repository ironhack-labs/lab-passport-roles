const express = require('express');
const router  = express.Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  
  User.collection.drop();
  
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync("boss", salt);

  const newUser = new User({
    username:"boss",
    password: hashPass,
    role:'Boss'
  });

  newUser.save((err) => {
    if (err) {
      res.render("auth/login", { message: "Something went wrong" });
    } else {
      res.render('index');
    }
  });


 



});

module.exports = router;
