const express = require('express');
const router  = express.Router();
const checkGuest  = checkRoles('GUEST');
const checkEditor = checkRoles('EDITOR');
const checkAdmin  = checkRoles('ADMIN');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', checkRoles('ADMIN'), (req, res) => {
  res.render('private', {user: req.user});
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

router.get('/private', checkAdmin, (req, res) => {
  res.render('private', {user: req.user});
});

router.get('/', checkEditor, (req, res) => {
  res.render('', {user: req.user});
});

router.get('/', checkGuest, (req, res) => {
  res.render('', {user: req.user});
});

module.exports = router;