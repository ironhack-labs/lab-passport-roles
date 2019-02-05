const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const bcryptSalt = 10;

const router = express.Router();

// Midleware CHECK-ROLES
function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }
    console.log('ALERTA! ACESSO NÃO AUTORIZADO');
    res.redirect('/login');
  };
}

const checkBoss = checkRoles('BOSS');

// Signup GET & POST routes
router.get('/signup', checkBoss, (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', checkBoss, (req, res, next) => {
  const { username } = req.body;
  const { password } = req.body;
  const { role } = req.body || 'GUEST';
  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
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
          res.render('auth/signup', { message: 'Something went wrong' });
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

// Admin Console Routes - CRUD process exclusive for ADMIN
// List ALL employees
router.get('/admin-console', checkBoss, (req, res) => {
  User.find({ role: { $ne: 'BOSS' } })
    .then((user) => {
      res.render('admin-platform', { user });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Edit employee role form
router.get('/users/edit/:id', checkBoss, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.render('user-edit', { user });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Edit employee role POST
router.post('/users/edit', checkBoss, (req, res) => {
  const { role } = req.body;
  User.update({ _id: req.query.userId }, { $set: { role } })
    .then(() => {
      res.redirect('/admin-console');
    })
    .catch((error) => {
      console.log(error);
    });
});

// Delete Employee
router.get('/users/delete/:id', checkBoss, (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect('/admin-console');
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
