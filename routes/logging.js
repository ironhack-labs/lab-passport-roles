const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();
const bcryptSalt = Number(process.env.SALT);
const saltWord = process.env.SALT_WORD;

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const {
    username,
    password,
    role
  } = req.body;
  
  User.findOne({username})
  
  .then(user => {
    if (user !== null) {
      throw new Error("Username Already exists");
    }
    
      console.log(bcryptSalt)
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(saltWord.concat(password),salt);
      
      const newUser = new User({
        username,
        password: hashPass,
        role: role
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

router.get('/login', (req, res, next) => {  
  res.render('login');
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: false,
    passReqToCallback: true
  })
)


router.get('/:id/delete',(req,res,next) => {
    User.findByIdAndRemove(req.params.id)
      .then ( ()  => {
        res.redirect('/platform/base');
      })
      .catch( (err)    => {
        next();
        console.log(err);
      })
});

router.get('/logout' , (req,res) => {
  req.logout();
  res.redirect('/');
})


module.exports = router;