const express = require('express');
const router  = express.Router();
const User = require("../models/User")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/users', (req, res, next) => {
  res.render('users');
});

const checkedRoles = (role) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == role) {
      next();
    } else {
      res.redirect('/auth/dashboard');
    }
  };
};

const isBoss = checkedRoles('Boss');

router.get('/:id/delete', isBoss, (req, res, next) => {
  const user = req.params.id;
  User.findByIdAndDelete(user)
    .then(() => {
      res.redirect('/auth/dashboard');
    })
    .catch(err => console.log(err))
});

/* GET edit page */
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render('edit', { user });
    })
    .catch(err => console.log(err))
});

module.exports = router;
