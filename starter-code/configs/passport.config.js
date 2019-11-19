const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const User = require('../models/User.model')


passport.serializeUser((user, cb) => cb(null, user._id));
passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, next) => {
  User.findOne({
      username
    })
    .then(theUser => {
      if (!theUser) return next(null, false, {
        message: "Nombre de usuario incorrecto"
      })
      if (!bcrypt.compareSync(password, theUser.password)) return next(null, false, {
        message: "Contraseña incorrecta"
      })
      return next(null, theUser);
    })
    .catch(err => next(err))
}))

module.exports = app => {

    
    app.use(session({
      secret: "MAD-DE",
      resave: true,
      saveUninitialized: true
    }));

    
    app.use(passport.initialize());
    app.use(passport.session());
    }