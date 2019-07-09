const express = require('express');

const passportRouter = express.Router();

// Require user model
const CourseModel = require('../models/course');
const User = require('../models/user');

// Add bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const saltRounds = 10;

// Add passport 
const passport = require("passport");

// const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");


passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

// sign up
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  // const {username} = req.body;
  // const {password} = req.body;
  const { username, password, role } = req.body;

  if (username === '' || password === '') {
    res.render('passport/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('passport/signup', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role,
      });

      newUser.save((err) => {
        if (err) {
          res.render('passport/signup', { message: 'Something went wrong' });
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

// displaying all users
passportRouter.get('/users', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find()
    .then((userObj) => {
      res.render('passport/users', { userObj });
    })
    .catch((err) => {
      res.redirect('passport/login');
    });
});

// displaying user info
passportRouter.get('/users/:id', (req, res) => {
  const userID = req.params.id;
  let flag = false;
  User.findById(userID)
    .then((personID) => {
      if (personID._id == req.user.id) {
        flag = true;
      }
      res.render('passport/profile', { user: personID, flag });
    })
    .catch(err => console.log(err));
});

// login
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login.hbs');
});

passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } 
      res.redirect('/login')
    
  };
}

const checkBoss = checkRoles('BOSS');
const checkTA = checkRoles('TA');
const checkDeveloper = checkRoles('DEVELOPER');

passportRouter.get('/onlyboss', checkBoss, (req, res) => {
  User.find()
    .then((userObj) => {
      res.render('passport/onlyboss', { userObj });
    })
    .catch((err) => {
      res.redirect('passport/login');
    });
});

passportRouter.get('/addcourse', checkTA, (req, res) => {
  res.render('passport/addCourse');
})

passportRouter.post('/taonly', (req, res) => {
  const { name, duration } = req.body;
  const newCourse = new CourseModel({
    name,
    duration,
  });

  newCourse.save((err) => {
    if (err) {
      res.render('passport/taonly', { message: 'Something went wrong' });
    } else {
      res.redirect('/taonly');
    }
  });
});

passportRouter.get('/taonly', checkTA, (req, res) => {
  CourseModel.find()
  .then((course) => {
    res.render('passport/taonly', { course })
  })
  .catch((err) => console.log(err))
});

passportRouter.post('/onlyboss/:id', (req, res, next) => {
  const deleteID = req.params.id;
  User.findByIdAndRemove(deleteID)
    .then((deletedUser) => {
      console.log(`${deletedUser.username} has been removed successfully.`);
      res.redirect('/onlyboss');
    })
    .catch(err => console.log(err));
});

passportRouter.post('/deletecourse/:id', (req, res, next) => {
  const deleteID = req.params.id;
  CourseModel.findByIdAndRemove(deleteID)
    .then((deletedCourse) => {
      console.log(`${deletedCourse.name} has been removed successfully.`);
      res.redirect('/taonly');
    })
    .catch(err => console.log(err));
});

module.exports = passportRouter;
