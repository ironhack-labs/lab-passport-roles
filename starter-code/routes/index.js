const express = require('express');
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require('../models/User')
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get('/', (req, res, next) => {
  res.render('login');
});

router.post("/login", passport.authenticate("local", {
  successReturnToOrRedirect: "/platform",
  failureRedirect: "/",
  failureFlash: false,
  passReqToCallback: true
}));


router.get("/platform", ensureLogin.ensureLoggedIn(), (req, res) => {

  User.find({})
    .then(usersData => {
      console.log(usersData);
      return res.render('platform', { data: usersData, user: req.user });
    })
    .catch(err => next(err));

});

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  User.findById(id)
    .then(user => {
      return res.render('edit', { user });
    })
    .catch(err => next(err));

});

router.post('/edit', (req, res, next) => {

  const { id } = req.body;
  const { username } = req.body;

  User.updateOne({ _id: id }, { $set: { username } })
    .then(() => res.redirect('platform'))
    .catch(err => next(err));
});

router.post('/:id/delete', (req, res, next) => {
  let id = req.params.id;

  User.findByIdAndRemove(id)
    .then(() => res.redirect('/platform'))
    .catch(err => next(err))
});

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/new', (req, res, next) => {
  res.render('new');
});

router.get('/:id/profile', (req, res, next) => {
  let id = req.params.id;
  User.findById(id)
    .then(user => {
      return res.render('profile', { user });
    })
    .catch(err => next(err));

});

router.post('/profile', (req, res, next) => {

  const { id } = req.body;
  const { username } = req.body;

  User.updateOne({ _id: id }, { $set: { username } })
    .then(() => res.redirect('platform'))
    .catch(err => next(err));
});

router.post('/new', (req, res, next) => {

  let username = req.body.username;
  let role = req.body.role;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const password = bcrypt.hashSync(req.body.password, salt);
  const newUser = new User({ username, password, role });

  newUser.save()
    .then((user) => {
      res.redirect('platform');
    })
    .catch(err => {
      return res.render('platform/new', { errorMessage: "There was an error, please resend the form" });
    })
});



module.exports = router;
