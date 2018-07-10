const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
const Employee = require('../models/employee');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');

router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {

  const { username, password } = req.body;

  // Check password promise
  let passCheck = new Promise((resolve, reject) => {
    if (username === "" || password === "") {
      return reject(new Error("Indicate a username and a password to sign up"));
    }
    resolve();
  })

  // Check password
  passCheck.then(() => {
    return User.findOne({ "username": username })
  })
    .then(user => {
      if (user !== null) {
        throw new Error("Username Already exists")
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role:[req.body.role]
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(e => {
      res.render("passport/signup", {
        errorMessage: e.message
      });
    });
})

router.get('/login', (req, res, next) => {
  res.render('passport/login', { "message": req.flash("error") });
});

router.get("/developer", [
  ensureLogin.ensureLoggedIn(''), 
  hasRole('Developer'),
], (req, res) => {
  Employee.find({}).then( employee => {
    res.render('passport/developer', { employee: employee, user: req.user});
  })
});

router.get("/private-page", [
  ensureLogin.ensureLoggedIn(''), 
  hasRole('Boss'),
], (req, res) => {
  Employee.find({}).then( employee => {
    res.render('passport/private', {employee});
  })
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      if (user.role=='Boss'){return res.redirect('/private-page')};
      if (user.role=='Developer'){return res.redirect('/developer')};
    });
  })(req, res, next);
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get('/new', (req, res, next) => {
  res.render('passport/new');
});

router.post('/new', (req, res, next) => {
  const {name, role} = req.body;
  new Employee({name,role})
  .save().then( employee => {
    //console.log("sucessfully created!");
    console.log(employee);
    res.redirect('/private-page');
  })
  .catch(err => {
    res.render('passport/new',{
      errorMessage:err.message
    })
  });
});

router.get('/delete/:id',(req,res) => {
  Employee.findByIdAndRemove(req.params.id, () => res.redirect('/private-page'));
})

router.get('/edit/:id', (req,res) => {
  User.findById(req.params.id).then(user => {
    res.render('passport/edit',{user});;
  })
 })
 
 
 router.post('/edit/:id', (req,res) => {
  const {name,role} = req.body;
  console.log(name, role, req.params.id);
  User.findByIdAndUpdate(req.params.id,{username:name,role})
      .then(user=> {
        res.redirect('/developer')
      })
 })


module.exports = router;