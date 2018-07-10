const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const router = express.Router();
const bcryptSalt = 10;
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');

/****Sign up******/
router.get('/signup', [
  ensureLoggedIn('/login'), 
  hasRole('Boss'),
] , (req,res) => {
  res.render('auth/signup');
})

router.post('/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  User.findOne({username})
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
        role: [req.body.role]
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", {
        errorMessage: err.message
      });
    })
})

/***Acceso a lista de usuarios*****/
router.get('/list', (req, res, next) => {
  User.find({}).then( users => {
    //filter*************
    res.render('auth/list', {users});
  })
  .catch(err => {console.log("Error!!!")})
});


/****Log in*****/
router.get('/login', (req, res, next) => {  
  res.render('auth/login');
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
)

/****Log out*****/
router.get('/logout' , (req,res) => {
  req.logout();
  res.redirect('/');
})

/****Delete*****/
router.post('/list/delete',(req,res,next) => {
  User.findByIdAndRemove(req.params.id, () => res.redirect('/signup'))
  .catch(err => next())
})


module.exports = router;