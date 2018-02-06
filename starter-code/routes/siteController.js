const express = require('express');
const siteController = express.Router();

siteController.get('/', (req, res, next) => {
  res.render('index');
});

siteController.get('/profile-page', (req, res, next) => {
  let user = req.session.currentUser;
  if (user) {
    res.render('users/profile', {user: user});
  } else {
    res.redirect('/');
  }
});

module.exports = siteController;
