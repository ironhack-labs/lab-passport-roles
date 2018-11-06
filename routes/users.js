const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect('/auth/login')
  }
}

function checkRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next()
    }
    else {
      res.redirect('/')
    }
  }
}

router.get('/edit-all', checkRole("BOSS"), (req, res, next) => {
  User.find()
    .then(allUsers => {
      res.render('boss/edit-all', {
        users: allUsers
      });
    })
});

router.get('/:id/delete', checkRole("BOSS"), (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      res.redirect('/users/edit-all')
    })
})

router.get('/view-all-profile', ensureAuthenticated, (req, res, next) => {
  User.find()
    .then(allUsers => {
      res.render('view-all-profile', {
        users: allUsers
      })
    })
})

router.get('/view-profile', ensureAuthenticated, (req, res, next) => {
  let id = req.user._id
  User.findById(id)
    .then(user => {
      res.render('view-profile', {
        user: user
      })
    })
})

router.get('/:id/edit', ensureAuthenticated, (req, res, next) => {
  let id = req.user._id
  User.findById(id)
    .then(user => {
      res.render('edit-my-profile', {
        user: user
      })
    })
})

router.post('/:id/edit', ensureAuthenticated, (req, res, next) => {
  let id = req.user._id
  User.findByIdAndUpdate(id, {
    username: req.body.username,
  })
    .then(user => {
      res.redirect('/users/view-profile')
    })
})






module.exports = router;