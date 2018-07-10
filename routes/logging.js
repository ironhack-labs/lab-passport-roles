const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();
const bcryptSalt = process.env.SALT;


router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log("USER ENCONTRADO");
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role: [req.body.role]
      });

      return newUser.save()

    })

    .then(user => {
      res.redirect("/");
    })

    .catch(err => {
      console.log(err);
      res.render("signup", {
        errorMessage: err.message
      });
    })
})