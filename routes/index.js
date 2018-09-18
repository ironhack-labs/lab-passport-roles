const express        = require("express");
const router         = express.Router();
// User model
const Rol           = require("../models/rol");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const saltRounds = 10;
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const LocalStrategy = require("passport-local").Strategy;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const user = req.body.username;
  const password = req.body.password;
  const role = req.body.rol;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  if (user === '' || password === '') {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  Rol.findOne({ 'user': user })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      console.log(req.body);
    
      const newRol = new Rol({
        user: req.body.username, //variable user devuelve null en DB. Dejamos req.body para que lo guarde
        role: role,
        password: hashPass
      });

      newRol.save()
        .then(() => {
          res.redirect('/login')
        })
    })
    .catch(err => next(err))
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "private",
  failureRedirect: "login",
  failureFlash:false,
  passReqToCallback: true
}));

module.exports = router;
