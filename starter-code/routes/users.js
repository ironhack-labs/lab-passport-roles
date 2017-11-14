const express = require('express');

// User model
const User = require('../models/user');
const profile = express.Router();

profile.get('/', function(req, res, next) {
  res.redirect('/edit');
});

profile.get('/edit', function(req, res, next) {
  let user = req.session.currentUser;

  User.findById(user._id, (err, detail) => {
    res.render('profile/edit', {detail:detail});
  });
});

profile.get('/:id', (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) { 
      return next(err);
    };
    if ((typeof(req.session.currentUser)) !== 'undefined' && req.session.currentUser.username == user.username) {
      // if its same show private page
      user['public'] = 0;
      res.render('profile/show', user);
    } else {
      res.render('profile/show', {
        name: user.name,
        jobTitle: user.jobTitle,
        imageUrl: user.imageUrl,
        company: user.company,
        public: 1
      });

    };
  });
});

profile.post('/:id', (req, res, next) => {
  let id = req.params.id;

  const updates = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle,
  };

  User.findByIdAndUpdate(id, updates, (err, profile) => {
    if (err){ return next(err); }

    return res.redirect("/employee/" + id);
  });
});

profile.get('/:id', (req, res, next) => {
  let id = req.params.id;

  User.findById(id, (err, detail) => {
    res.render('celebrity/bio', {
      Bio: detail
    });
  });
});

profile.post('/:id/delete', (req, res, next) => {
  let id = req.params.id;

  User.findByIdAndRemove(id, (err, user) => {
    if (err){ return next(err); }

    return res.redirect('/employee');
  });
});

module.exports = profile;
