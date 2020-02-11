const express = require('express');
const router  = express.Router();

const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt")
const bcryptSalt = 10
const flash = require('connect-flash')
const User = require("../models/usermodel")


// POST for user-creator

router.post("/create-user", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("roles/private", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render("/private", {
          message: "The username already exists"
          
        });
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
          res.render("/", {
            message: "Something went wrong"
          });
        } else {
          res.redirect("/private");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});



// renders all the users in private

// router.get('/private', (req, res, next) => {
//   User.find()
//     .then(user => res.render('roles/private', {
//       user
//     }))
//     .catch(() => {
//       next()
//     })
// });





module.exports = router;
