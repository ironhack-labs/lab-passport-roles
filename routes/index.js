const express = require('express');
const passport = require('passport');
const router  = express.Router();
const User = require('../models/User');
const Course= require('../models/Course');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const checkRoles = require('../middleware/checkRole').checkRoles;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {  
  res.render('index');
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
});

router.get('/add',checkRoles('ADMIN'), (req,res,next) => {
  res.render('add');
})

router.post('/add',  (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role: req.body.role
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/list");
    })
    .catch(err => {
      console.log(err);
      res.render("add", {
        errorMessage: err.message
      });
    })
})

router.get('/signup', (req,res,next) => {
  res.render('signup');
})

router.post('/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("signup", {
        errorMessage: err.message
      });
    })
})

router.get('/list', (req,res,next) => {
  if( req.user.role != "STUDENT"){
    User.find()
    .then(users => {
      console.log(users);
      res.render('list', {users});
    })
  } else {
    User.find({role: "STUDENT"})
    .then(users => {
      console.log(users);
      res.render('list', {users});
    })
  }
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
)

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
})

router.get('/edit', (req, res, next) => {
  res.render('edit');
})

router.post('/edit', (req,res) => {
  const { username } = req.body;
  User.findOneAndUpdate({'username': req.user.username},{username})
      .then( user => {
        res.redirect('/profile')
      })
})

module.exports = router;
