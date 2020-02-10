const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/User');
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport 
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

const checkBoss  = checkRoles('BOSS');


passportRouter.get('/create-user', checkBoss, (req, res) => {
  res.render('create-user');
});

passportRouter.post('/create-user', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("create-user", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render("create-user", {
          message: "The username already exists"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role: req.body.role
      });

      newUser.save((err) => {
        if (err) {
          res.render("create-user", {
            message: "Something went wrong"
          });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role[0] === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = passportRouter;