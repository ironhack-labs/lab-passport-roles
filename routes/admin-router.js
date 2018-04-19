const passport = require('passport');

const express = require("express");

const bcrypt = require('bcrypt');

const User = require('../models/user-model');

const router = express.Router();

router.get('/boss/users', (req, res, next) => {
  if (!req.user || req.user.role !== "Boss") {
    next();
    return;
  }
  User.find()
    .then((usersFromDb) => {
      res.locals.userList = usersFromDb;
      res.render('boss-views/user-list-page');
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/process-create-user', (req, res, next) => {
  const {fullName, email, password, role} = req.body;
  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);
  if (password === "") {
    res.redirect('/boss/users');
    return;
  }
  User.create({fullName, email, encryptedPassword, role})
    .then(() => {
      res.redirect('/boss/users');
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/delete-user/:userId', (req, res, next) => {
  // if (req.user.role === "Boss") {
  //   console.log("Cannot delete BOSS");
  //   return;
  // }
  let userId = req.params.userId;
  User.remove({_id: userId})
    .then(() => {
      res.redirect('/boss/users');
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;