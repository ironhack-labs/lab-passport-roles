const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const Course = require('../models/course');

const loginCheck = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.redirect("/login");
  };
};

router.get('/', (req, res, next) => {
  res.render('index');
});

//router.use(loginCheck());

router.get('/profiles', (req, res) => {
  User.find({}).then(profiles => {
    res.render('profiles', { profiles });
  }).catch(err => console.log(err));
});

router.get('/profiles/show/:id', (req, res) => {
  if (req.user._id == req.params.id) {
    let user = req.user;
    res.render('profiles/show', { user });
  } else {
    res.redirect('/');
  }
});

router.get('/courses', loginCheck(), (req, res) => {
  Course.find({}).populate({path: 'teacher'}).then(courses => {
    console.log(courses);
    let ta = req.user.role == 'TA';
    res.render('courses', { courses, ta })
  }).catch(err => {console.log(err)})
})

module.exports = router;
