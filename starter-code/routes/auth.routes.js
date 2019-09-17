const express = require('express');
const router = express.Router();
const User = require('../models/User');
const secure = require('../middlewares/secure.mid');
const bcrypt = require('bcrypt');
const passport = require('passport');
// const ensureLogin = require("connect-ensure-login");

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;
  
  if (username==='' || password==='') {
    res.render('auth/signup', { message: 'Please indicate a username and password' });
  }
  
  User.findOne({ username })
  .then((user) => {
    if (user) {
      res.render('auth/signup', { message: 'Username already exsits' });
    }
    const bcryptSalt = 10;
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    User.create({
      username,
      password: encryptedPassword
    })
    .then(userCreated => {
      console.log(userCreated);
      res.render("./passport/login");
    })
    .catch(error => next(error));
  });
});
//     const newUser = new User({
//       username,
//       password: hashPass,
//     });

//     newUser.save()
//     .then(() => res.redirect('/'))
//     .catch(error => next(error));
//   })
//   .catch(error => next(error));
// });

router.get("/login", (req, res) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate ('local-auth', {
  successRedirect: '/private',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}));


router.get('/private', secure.checkLogin, (req, res, next) => {
  res.render('auth/private', { user: req.user });
});

router.get('/admin', secure.checkRole('BOSS'), (req, res, next) => {
  res.render('auth/admin', { user: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;