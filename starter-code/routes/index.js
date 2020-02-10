const express = require('express');
const router = express.Router();

/* GET home page */


// User model
const User = require("../models/boss.js");
const passport = require("passport");
// Bcrypt to encrypt passwords
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
const checkBoss = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTa = checkRoles('TA');

router.get('/options', (req, res) => {
  res.render('options')
})

router.get('/private-page', checkBoss, (req, res) => {
  res.render('private', {
    user: req.user
  });
});

router.post('/userPOST', checkBoss, (req, res, next) => {
 password = req.body.password
 const salt = bcrypt.genSaltSync(bcryptSalt);
 // res.json(password)
 const hashPass = bcrypt.hashSync(password, salt)
  User.create({
      username: req.body.username,
      role: req.body.role,
      password: hashPass
    })
    .then(() => {
      res.redirect('/users')
    })
})

router.get('/users', checkBoss, (req, res, next) => {
  User.find()
    .then((user) => {
      res.render('users', {
        user
      })
    })
})

router.get('/userDEL/:idUser', checkBoss, (req, res, next) => {
  id = req.params.idUser
  // res.json(id)
  User.findByIdAndDelete(req.params.idUser)
    .then(() => {
      res.redirect('/users')
    })
})

router.get('/user/update/:idUser', checkBoss, checkDeveloper, (req, res, next) => {
  id = req.params.idUser
  User.findById(id)
    .then((userUpd) => {
      res.render('update', {
        userUpd
      })
    })
})

router.post('/userUPD/:idUser', checkBoss, checkDeveloper, (req, res, next) => {
  id = req.params.idUser
  password = req.body.password
  const salt = bcrypt.genSaltSync(bcryptSalt);
  // res.json(password)
  const hashPass = bcrypt.hashSync(password, salt);

  User.findByIdAndUpdate(id, {

      username: req.body.username,
      role: req.body.role,
      password: hashPass
    })
    .then(() => {
      res.redirect('/users')
    })
})


// router.get('/private', checkAdmin, (req, res) => {
//   res.render('private', {
//     user: req.user
//   });
// });

// router.get('/posts', checkEditor, (req, res) => {
//   res.render('private', {
//     user: req.user
//   });
// });

module.exports = router;