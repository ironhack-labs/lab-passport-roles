const express = require('express');
const bcrypt = require('bcrypt');
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');
const ModelUser = require('../models/User');

const router = express.Router();

const bcryptSalt = 10;

// GET => home page
router.get('/', (req, res) => {
  res.render('index');
});

// GET => signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

// POST => signup page
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const encryptedPass = bcrypt.hashSync(password, salt);
  const newUser = ModelUser({
    username,
    password: encryptedPass
  });

  if (username === '' || password === '') {
    res.render('signup', {
      errorMessage: 'fill in the username and password!'
    });
    return;
  }

  ModelUser.findOne({ username }).then((user) => {
    if (user !== null) {
      res.render('signup', { errorMessage: 'username already exists!' });
      return;
    }
    newUser.save()
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => {
        next(error);
      });
  });
});

// GET => render the form to create a NEW USER
router.get('/signin', (req, res) => {
  res.render('signin');
});

// POST => to create NEW USER and save it to the DB
router.post('/signin', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('signin', {
      errorMessage: 'fill in the username and password!'
    });
    return;
  }

  ModelUser.findOne({ 'username': username })
    .then((user) => {
      if (!user) {
        res.render('signin', {
          errorMessage: 'username already exists!'
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.render('private');
      } else {
        res.render('signin', {
          errorMessage: 'Incorrect password'
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});


// PRIVATE => PROTECTED ROUTES
router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/signin');
  }
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

// GET => LOGOUT
router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
