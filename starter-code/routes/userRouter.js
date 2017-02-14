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

userRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find({}, (error, users)=> {
    if (error) {
      next(error);
    } else {
      res.render('index', { user: req.user, users });
    }
  })
});

// BOSS ROLES
userRouter.get("/create-user", checkBoss, (req, res, next) => {
  res.render("create", {user: req.user});
});

// BOSS ROLES
userRouter.get("/create-course", checkTa, (req, res, next) => {
  res.render("createCourse", {user: req.user});
});



//PRIVATE PAGE
userRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

//EDIT PAGE
userRouter.get("/edit-user", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("edit", {user: req.user});
});



userRouter.get('/:userId', (req, res, next) => {
  let userId = req.params.userId;
  User.findById(userId, (err, user)=> {
    if (err) {
      next(err);
    } else {
      console.log(user);
      res.render('users/show', { user: user})
    }
  })
})

// userRouter.get("/:userId/edit", ensureLogin.ensureLoggedIn(), (req, res, next) => {
//   res.render("users/edit", {user: req.user});
// });


// userRouter.post('/:userId/update', (req, res, next) => {
//   let userToUpdate = {
//     username: req.body.username,
//   }
//   User.findByIdAndUpdate(req.params.userId, userToUpdate, (err, user) => {
//     if (err) {
//       next(err)
//     } else {
//       res.redirect('/:userId');
//     }
//   })
// });


module.exports = userRouter;
