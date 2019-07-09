const express = require('express');
const router  = express.Router();
const User = require('../models/users');

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

const isBoss = checkedRoles('BOSS');

/* GET delete page */
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

/* router.post('/:id/edit', (req, res, next) => {
  const { username, password } = req.body;

  User.update({_id: req.params.id }, { $set: { username, password }})
    .then((book) => {
      res.redirect('/auth/dashboard');
    })
    .catch((error) => {
      console.log(error);
    })
}); */

module.exports = router;
