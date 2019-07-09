const express = require('express');
const router  = express.Router();
const Course = require('../models/course');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/course', (req, res, next) => {
  Course.find()
  .then(courses => {
    res.render('course/index', {courses});
  })
  .catch(err => console.log(err))

});

router.get('/user', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
  .then(users => {
    users.map(user => {
      if (user._id.equals(req.user._id)) {
        user.canEdit = req.user._id;
      }
      if (req.user.role === 'Boss') {
        user.canDelete = true;
      }
    });
    res.render('user/index', {users, user: req.user});
  })
  .catch(err => console.log(err))
});

router.get('/user/new', checkRoles('Boss'), (req, res, next) => {  
  res.render('user/new');
});

router.get('/user/edit', (req, res, next) => {
  User.findById(req.user._id)
  .then(user => {
    res.render('user/edit', user);
  })
  .catch(err => console.log(err))
});

router.post('/user/new', checkRoles('Boss'), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("user/new", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("user/new", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("user/new", { message: "Something went wrong" });
      } else {
        res.redirect("/user");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

router.get('/course/new', checkRoles('TA'), (req, res, next) => {
  res.render('course/new');
});

router.post('/course/new', checkRoles('TA'), (req, res, next) => {
  let { name, duration } = req.body;
  Course.create(new Course({name, duration}))
  .then(() => {
    res.redirect('/course');
  })
  .catch(err => console.log(err));
});

router.post('/course/edit', checkRoles('TA'), (req, res, next) => {
  const { name, duration } = req.body;

  Course.update({_id: req.body.courseID}, { $set: {name, duration}})
  .then(() => {
    res.redirect('/course/');
  })
  .catch((error) => {
    console.log(error);
  })
});

router.post('/user/edit', (req, res, next) => {
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.update({_id: req.user._id}, { $set: {password: hashPass }})
  .then(() => {
    res.redirect('/user/');
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/user/:userID', (req, res, next) => {
  User.findById(req.params.userID)
  .then(user => {
    res.render('user/userPage', user);
  })
  .catch(err => console.log(err))
});

router.get('/course/edit/:courseId', checkRoles('TA'), (req, res, next) => {
  Course.findById(req.params.courseId)
  .then(course => {
    res.render('course/edit', course);
  })
  .catch(err => console.log(err))
});

router.get('/user/remove/:userID', checkRoles('Boss'), (req, res, next) => {
  User.findByIdAndRemove(req.params.userID)
  .then(() => {
    res.redirect('/user');
  })
  .catch(err => console.log(err))
});

module.exports = router;

