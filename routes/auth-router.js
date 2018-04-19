const passport = require('passport');

const express = require('express');

const bcrypt = require('bcrypt');

const User = require('../models/user-model');

const router = express.Router();

router.get('/signup', (req, res, next) => {
  res.render('auth-views/signup-form.hbs');
});

router.post('/process-signup', (req, res, next) => {
  const {fullName, email, password} = req.body;

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);
  if (password === "") {
    res.redirect('/signup');
    return;
  }
  User.create({fullName, email, encryptedPassword})
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/login', (req, res, next) => {
  res.render('auth-views/login-form.hbs');
});

router.post('/process-login', (req, res, next) => {
  const {email, password} = req.body;
  User.findOne({email})
    .then((userDetails) => {
      if (!userDetails) {
        res.redirect('/login');
        return;
      }
      const {encryptedPassword} = userDetails;
      if (!bcrypt.compareSync(password, encryptedPassword)) {
        res.redirect('/login');
        return;
      }
      req.login(userDetails, () => {
        res.redirect('/');
      });
    })
    .catch((err) => {
      next(err);
    });

});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.get('/user-profile/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .then((userDetails) => {
      res.locals.userInfo = userDetails;
      res.render('user-views/user-profile');
    })
    .catch((err) => {
      next(err);
    });
  // res.render('user-views/user-profile');
});

router.get('/edit-profile/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .then((userDetails) => {
      res.locals.userInfo = userDetails;
      res.render('user-views/edit-page');
    })
    .catch((err) => {
      next(err);
    })
});

router.post('/process-edit-profile/:userId', (req, res, next) => {
  const {fullName, email} = req.body;
  User.findByIdAndUpdate(
    req.params.userId,
    {fullName, email},
    {runValidators: true}
  )
    .then(() => {
      res.redirect(`/user-profile/${req.params.userId}`);
    })
    .catch((err) => {
      next(err);
    })
});

router.get('/view-users', (req, res, next) => {
  if (!req.user) {
    next();
    return;
  }
  User.find()
    .then((usersFromDb) => {
      res.locals.userList = usersFromDb;
      res.render('user-views/user-list');
    })
    .catch((err) => {
      next(err);
    });
})

module.exports = router;