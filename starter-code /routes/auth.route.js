const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const secure = require('../middlewares/secure.mid');

const router = express.Router();
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Please indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { message: 'Username already exists' });
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      newUser.save()
        .then(() => res.redirect('/login'))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local-auth', {
  successRedirect: '/private',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}));

router.get('/private', secure.checkLogin, (req, res, next) => {
  res.render('auth/private', { users: req.user });
});

router.get('/admin', secure.checkRole('Boss'), (req, res, next) => {
  User.find({})
    .then(allUsers =>
      res.render("auth/admin", { users: allUsers })
    )
    .catch(error => next(error))

});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.get("/staff", (req, res, next) => {
  User.find({})
    .then(allUsers =>
      res.render("auth/staff", { users: allUsers })
    )
    .catch(error => next(error));
});

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then(userDetail =>
      res.render("auth/profile", { user: userDetail })
    )
    .catch(error => next(error));
});

router.get("/private/:id/update", (req, res, next) => {
  User.findById(req.params.id)
    .then(userDetail =>
      res.render("auth/update", { user: userDetail })
    )
    .catch(error => next(error));
});

router.post("/private/:id/update", (req, res) => {
  User.findByIdAndUpdate(req.body._id, req.body).then(userDetail => {
    res.redirect("/private");
  });
});

router.get("/:id/edit", (req, res, next) => {
  User.findById(req.params.id)
    .then(userDetail =>
      res.render("auth/edit", { user: userDetail })
    )
    .catch(error => next(error));
});

router.post("/:id/edit", (req, res) => {
  User.findByIdAndUpdate(req.body._id, req.body).then(userDetail => {
    res.redirect("/admin");
  });
});

router.get("/:id/delete", (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(deletedUser => res.redirect("/admin"))
    .catch(error => next(error));
});

module.exports = router;
