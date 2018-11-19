const express = require("express");
const rolesRouter = express.Router();
// Require user model
const User = require("../models/User.js")
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport 
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");

/* GET signup page */
rolesRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

/* POST signup page */
rolesRouter.post('/signup', (req, res, next) => {
  console.log(req.body);
  const saltRounds = 10;

  const user = req.body.username;
  const pwd = req.body.password;
  const roleSelected = req.body.role;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPwd = bcrypt.hashSync(pwd, salt);

  let newUser = new User({
    username: user,
    password: hashPwd,
    role: roleSelected
  })

  newUser.save()
    .then((newUser) => {
      console.log(newUser);
      res.redirect('/login');
    })
    .catch((error) => {
      console.log(error);
    })

})

rolesRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

rolesRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

checkRoles = (role) => {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role.includes(role)) {
      return next();
    } else {
      // Enter here if is a Developer or a TA
      res.redirect('/private-users');
    }
  }
}


rolesRouter.get('/private', checkRoles(['Boss']), (req, res) => {
  User.find()
  .then((users) => {
    res.render('passport/private', {users, user: req.user});
  })
  .catch((error) => {
    console.log(`Error finding users ${error}`);
  })
});


// GET new celebrity page
rolesRouter.get('/private/new', (req, res, next) => {
  res.render('passport/new');
});


rolesRouter.post('/private/new', (req, res, next) => {
  const saltRounds = 10;

  const user = req.body.username;
  const pwd = req.body.password;
  const roleSelected = req.body.role;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPwd = bcrypt.hashSync(pwd, salt);

  let newUser = new User({
    username: user,
    password: hashPwd,
    role: roleSelected
  })

  newUser.save()
    .then((newUser) => {
      console.log(newUser);
      res.redirect('/private');
    })
    .catch((error) => {
      console.log(error);
    })

})

rolesRouter.post('/private/delete/:id', (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
  .then((user) => {
    res.redirect('/private');
    console.log(`User ${user.username} has been deleted`);
  })
  .catch(err => console.log(err))
});



// USERS

rolesRouter.get('/private-users', (req, res) => {
  User.find()
  .then((users) => {
    res.render('passport/privateuser', {users, user: req.user});
  })
  .catch((error) => {
    console.log(`Error finding users ${error}`);
  })
});



rolesRouter.get('/private-users/edit/:id', (req, res) => {
  User.findById(req.params.id)
  .then((user) => {
    res.render('passport/user-edit', {user});
  })
  .catch((error) => {
    console.log(`Error finding users ${error}`);
  })
});

rolesRouter.post('/private-users/edit/:id', (req, res) => {

  User.findOneAndUpdate({_id: req.params.id}, { username: req.body.username,  password: req.body.password })
  .then((user) => {
    res.redirect('/private-users');
  })
  .catch((error) => {
    console.log(`Error updating users ${error}`);
  })
});




module.exports = rolesRouter;