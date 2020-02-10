const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/", (req, res, next) => {
  res.render("login");
});
  
function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkBoss = checkRoles('Boos');
const checkDeveloper = checkRoles('Developer');
const checkTa = checkRoles('TA');

router.get('/options', (req, res) => {
  res.render('options')
});

router.get('/private-page', checkBoss, (req, res) => {
  res.render('private', {
    user: req.user
  });
});

router.post('/userPOST', checkBoss, (req, res, next) => {
  plainPassword = req.body.password
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hash = bcrypt.hashSync(plainPassword, salt)
   User.create({
       username: req.body.username,
       password: hash,
       role: req.body.role
     })
     .then(() => {
       res.redirect('/users')
     })
 });

 router.get('/users', checkBoss, (req, res, next) => {
  User.find()
    .then((user) => {
      res.render('users', {
        user
      })
    })
});

router.get('/userDEL/:idUser', checkBoss, (req, res, next) => {
  id = req.params.idUser
  User.findByIdAndDelete(req.params.idUser)
    .then(() => {
      res.redirect('/users')
    })
});

router.get('/user/update/:idUser', checkBoss, checkDeveloper, (req, res, next) => {
  id = req.params.idUser
  User.findById(id)
    .then((userUpd) => {
      res.render('update', {
        userUpd
      })
    })
});

router.post('/userUPD/:idUser', checkBoss, checkDeveloper, (req, res, next) => {
  id = req.params.idUser
  plainPassword = req.body.password
  const salt = bcrypt.genSaltSync(bcryptSalt);
  // res.json(password)
  const hash = bcrypt.hashSync(plainPassword, salt);

  User.findByIdAndUpdate(id, {

      username: req.body.username,
      password: hash,
      role: req.body.role
    })
    .then(() => {
      res.redirect('/users')
    })
});
  
module.exports = router;