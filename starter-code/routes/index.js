const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// Check roles
function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }
    return res.redirect('/login');
  };
}

// Sign up
router.get('/add', checkRoles('BOSS'), (req, res) => {
  res.render('../views/auth/add.hbs');
});

router.post('/add', (req, res, next) => {
  const { username, password, role } = req.body;

  if (username === '' || password === '') {
    res.render('../views/auth/add.hbs', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('../views/auth/add.hbs', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role,
      });

      newUser.save((err) => {
        if (err) {
          res.render('../views/auth/add.hbs', { message: 'Something went wrong' });
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

// Login
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: 'auth/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Profile-page
router.get('/profile', ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find()
    .then((data) => {
      res.render('profile', { data });
    })
    .catch(err => console.log(err));
});

router.get('/profile/:id', ensureLogin.ensureLoggedIn(), (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      console.log(data)
      res.render('user', data);
    })
    .catch(err => console.log(err));
});

router.get('/edit/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      res.render('edit', user);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/edit/:id', (req, res, next) => {
  const { username, role } = req.body;

  User.update({ _id: req.params.id }, { $set: { username, role } })
    .then((user) => {
      res.redirect('edit' + req.params.id);
    })
    .catch((error) => {
      console.log(error);
    });
});
module.exports = router;
