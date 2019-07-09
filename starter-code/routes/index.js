const express = require('express');
const router  = express.Router();

// User model
const User = require("../models/user");

// ensure log In
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const ownProfile = req.user._id;
  res.render('main', {ownProfile});
});

// profile list page
router.get('/profile-list', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
  .then(user => {
    res.render('profile-list', { user });
  })
  .catch(err => console.log(err));
});

// profile info page
router.get('/profile/:userID', (req, res) => {
  const profileUser = req.params.userID;
  console.log('profile' + profileUser)
  console.log('req' + req.user._id)
  let edit = false;
  if(req.user._id == profileUser) {
    edit = true;
  }

  User.findById(profileUser)
  .then(user => {
    res.render('profile', {user, edit});
  })
  .catch(err => console.log(err));
});

// profile edit page
router.get('/profile/edit/:userID', (req, res, next) => {
  User.findById(req.params.userID)
  .then((user) => {
    res.render("profile-edit", {user});
  })
  .catch((error) => {
    console.log(error);
  })
});

router.post('/profile/edit/:userID', (req, res, next) => {
  const { firstName, lastName, age} = req.body;

  User.update({_id: req.params.userID}, { $set: {firstName, lastName, age}})
  .then((user) => {
    res.redirect('/profile/' + req.params.userID);
  })
  .catch((error) => {
    console.log(error);
  })
});

// courses

router.get('/courses/add', (req, res) => {
  res.render('courses-add');
});

router.get('/courses/edit', (req, res) => {
  res.render('courses-edit');
});

module.exports = router;
