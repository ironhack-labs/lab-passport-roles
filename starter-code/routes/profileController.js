const express = require('express');
const profileController = express.Router();

const ensureLogin = require('connect-ensure-login');
const bcrypt = require('bcrypt');
const User = require('../models/User');

profileController.get('/:id', ensureLogin.ensureLoggedIn(), (req, res)=> {

  let editable;
  let currentUserId = req.user._id.toString();

  User.findById({ _id: req.params.id }, (err, user) => {
    if (err) {
     next(err);
     return;
    }

    editable = currentUserId === user._id.toString()

    res.render('profiles/show', {
      editable: editable,
      user: user
    });
  });
});

profileController.post('/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let id = req.params.id

  const updates = {
    name: req.body.name,
    familyName: req.body.familyName,
    username: req.body.username
  };

  User.findByIdAndUpdate(id, updates, (err, user) => {
    return  err ? next(err) : res.redirect(`/profiles/${id}`);
  });
});

profileController.get('/:id/edit', ensureLogin.ensureLoggedIn(), (req, res)=> {
  let currentUserId = req.user._id.toString();

  if(req.params.id !== currentUserId){
    return res.redirect('/');
  }

  let user = User.findById({ _id: currentUserId }, (err, user) => {
    res.render('profiles/edit', { user: user });
  });
});

module.exports = profileController;
