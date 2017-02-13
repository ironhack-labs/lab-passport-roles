const express        = require("express");
const userRouter     = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const flash          = require("connect-flash");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      console.log("role error")
      res.redirect('/')
    }
  }
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log("auth error")
    res.redirect('/')
  }
}

var checkBoss  = checkRoles("BOSS");
var checkDeveloper = checkRoles("DEVELOPER");
var checkTa  = checkRoles("TA");



// BOSS ROLES
userRouter.get("/create-user", checkBoss, (req, res, next) => {
  res.render("create", {user: req.user});
});

//PRIVATE PAGE
userRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

//EDIT PAGE
userRouter.get("/edit-user", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("edit", {user: req.user});
});

userRouter.post('/edit-user', (req, res, next) => {
  let userToUpdate = {
    username: req.body.username,
  }
  User.findByIdAndUpdate(req.params._id, userToUpdate, (err, user) => {
    if (err) {
      next(err)
    } else {
      console.log();
      res.redirect('/');
    }
  })
});


// router.get('/:userId', (req, res, next) => {
//   let celebrityId = req.params.userId;
//   User.findById(celebrityId, (err, user)=> {
//     if (err) {
//       next(err);
//     } else {
//       console.log(user);
//       res.render('user/show', { user: user})
//     }
//   })
// })


module.exports = userRouter;
