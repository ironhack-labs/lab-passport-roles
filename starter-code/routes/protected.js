const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const Course = require('../models/course');
const bcrypt = require('bcrypt');

function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

// TA stuff - course admin
router.get('/courses/new', checkRoles('TA'), (req, res) => {
  res.render('courses/new');
})

router.post('/courses', checkRoles('TA'), (req, res) => {
  Course.create({
    name: req.body.name,
    description: req.body.description,
    teacher: req.body.teacher,
  }).then(course => {
    console.log(course);
    res.redirect('/courses');
  }).catch(err => { console.log(err) });
})

router.get('/courses/edit/:id', checkRoles('TA'), (req, res) => {
  Course.findById(req.params.id).then(course => {
    res.render('courses/edit', { course });
  }).catch(error => {
    console.log('error editing a course: ', error)
  });
});

router.post('/courses/edit/:id', checkRoles('TA'), (req, res) => {
  let { name, description, teacher } = req.body;
  Course.findByIdAndUpdate(req.params.id, { name, description, teacher })
  .then((course) => {
    res.redirect('/courses/show/' + course._id);
  })
  .catch((error) => {
    console.log(error);
  });
})

// Admin stuff - user admin
router.use(checkRoles('BOSS'));

router.get('/profiles/new', (req, res) => {
  res.render('profiles/new');
});

router.post('/profiles', (req, res) => {
  const salt = bcrypt.genSaltSync();
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: hashPass,
    role: req.body.role
  }).then(user => {
    console.log(user);
    res.redirect('/profiles');
  }).catch(err => { console.log(err) });
})

router.get('/profiles/:id/delete', (req, res, next) => {
  User.findByIdAndDelete(req.params.id).then(() => {
    console.log("Success");
    res.redirect('/profiles');
  })
  .catch((err) => {
    console.log("error deleting employee: ", err);
    next();
  });
})

module.exports = router;