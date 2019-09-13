const express = require("express");
const authRoute = express.Router();
const User = require("../models/User");
const bcrypt= require("bcrypt");
const passport = require("passport");
const bcryptSalt = 5;
const ensureLogin = require("connect-ensure-login");

const checkRoles = (role) => {
  return (req, res, next) => {
    if(req.isAuthenticated() && req.user.role == role) {
      next();
    }else {
      res.redirect("login");
    }
  };
};

const boss = checkRoles("Boss");
const dev =  checkRoles("Dev");

authRoute.get("/dashboard", async (req, res, next) => {
  User.find()
  .then((user) => {
    res.render('auth/dashboard', {user});
  })
  .catch(err => console.log(err));
});

authRoute.get("/signup", boss, (req, res, next) => {
  User.find()
  .then(user) => {
    res.render("auth/signup", { user });
  })
  .cath(err => console.log(err));
});

authRouter.post('/signup', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const { username, password, role } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Write your username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
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
          res.render('auth/signup', { message: 'Everything it wrong' });
        } else {
          res.redirect('/auth/signup');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});


authRouter.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/auth/dashboard',
  failureRedirect: '/auth/login',
  passReqToCallback: true,
}));

module.exports = authRouter;