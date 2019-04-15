const express = require('express');
const router  = express.Router();

// Passport config
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bcriptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const flash = require('connect-flash');

const User = require('../models/User');

router.use(session({
  secret: 'dfgh4567*¨REFGEFVCÇ¨Ñ^*',
  resave: true,
  saveUninitialized: true,
}))

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
})

router.use(flash());
passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(null, false, { message: "Incorrect username" });
    if (!bcrypt.compareSync(password, user.password)) return next(null, false, { message: "Incorrect password" });

    return next(null, user);
  });
}));

router.use(passport.initialize());
router.use(passport.session());
// END passport config

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === ""){
    res.render('auth/signup', {message: 'Username and password are required!'});
    return;
  }

  User.findOne({username})
    .then(user => {
      if(user){
        res.render('auth/signup', { message: 'The username already exists!'});
        return;
      }

      const salt = bcrypt.genSaltSync(bcriptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({username, password: hashPass})
        .then(() => res.redirect('/'))
        .catch(err => {
          res.render('auth/signup', {message: 'Something went wrong'});
          next(err);
        });
    });

});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/admin', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('admin/index');
});

module.exports = router;