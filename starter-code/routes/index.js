const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const Courses = require('../models/Courses')

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      next();
    } else {
      res.redirect('/login');
    }
  };
};

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/show-users', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
    .then((users) => {
      users = users.map((user) => {
        if (user._id.equals(req.user._id)) {
          user.isMe = true;
        }
        return user;
      });
      res.render('showUsers', { users });
    })
    .catch((error) => console.log(error));
});

router.get('/edit/:userID', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.findById(req.params.userID)
  .then(user => {
    res.render('users/edit', user);
  })
  .catch(error => console.log(error))
});

router.post('/edit/:userID', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const {username, password, role} = req.body;
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  User.findByIdAndUpdate(req.params.userID, { username: username, password: hash, role: role })
  .then(() => {
    res.redirect(`/show/${req.params.userID}`);
  })
  .catch(error => console.log(error))
});

router.get('/show/:userID', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.findById(req.params.userID)
  .then(user => {
    res.render('users/show', user);
  })
  .catch(error => console.log(error))
});

router.get('/courses', (req, res, next) => {
  Courses.find()
  .then(courses => {
    res.render('courses/courses', { courses });
  })
  .catch(error => console.log(error))
});

router.get('/courses/show/:courseID', (req, res, next) => {
  Courses.findById(req.params.courseID)
  .then(course => {
    res.render('courses/show', course);
  })
  .catch(error => console.log(error))
});

router.get('/courses/edit/:courseID', checkRole('TA'), (req, res, next) => {
  Courses.findById(req.params.courseID)
  .then(course => {
    res.render('courses/edit', course);
  })
  .catch(error => console.log(error))
});

router.post('/courses/delete', checkRole('TA'), (req, res, next) => {
  Courses.findByIdAndDelete(req.body.deleteID)
  .then(() => {
    res.redirect('/courses');
  })
  .catch(error => console.log(error))
});

router.get('/courses/create', checkRole('TA'), (req, res, next) => {
  res.render('courses/create');
});

router.post('/courses/create', checkRole('TA'), (req, res, next) => {
  const { title } = req.body;
  Courses.findOne({title: {$eq: title }})
    .then((duplicate) => {
      if (duplicate) {
        res.render('/courses/create', { message: 'this title is taken' });
      } else {
        Courses.create({title: title })
          .then(() => {
            res.redirect('/courses');
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => console.log(error));
});

router.post('/courses/:courseID', checkRole('TA'), (req, res, next) => {
  const {title} = req.body;
  Courses.findByIdAndUpdate(req.params.courseID, { title: title})
  .then(() => {
    res.redirect(`courses/show/${req.params.courseID}`);
  })
  .catch(error => console.log(error))
});

module.exports = router;
