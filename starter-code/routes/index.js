const express = require("express");
const router = express.Router();

// Require user model
const User = require("../models/user")

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport 
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

//Log In
router.get("/", (req, res, next) => {
  res.render("login", {
    "message": req.flash("error")
  });
});

router.post("/login", passport.authenticate("local", {
  // successRedirect: "/private-page",
  successRedirect: "/private-page",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

//Middleware checkRoles

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}

const checkBoss = checkRoles('Boss');
const checkTA = checkRoles('TA');
const checkDevelopers  = checkRoles('Developers')

//private page Admin

router.get("/private-page", checkBoss, (req, res) => {
    User.find()
    .then((users) => {
      res.render('private', {
        users
      })
      res.render("private", [{
        user: req.user
      }, users]);
    })
});

// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   User.find()
//     .then((users) => {
//       res.render('private', {
//         users
//       })
//       res.render("private", [{
//         user: req.user
//       }, users]);
//     })
// });

//Private page TA

router.get('/private-page', checkTA, (req, res) => {
  res.render('private', {user: req.user});
});


//Create User

router.post("/createaccount", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "") {
    res.render("private", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render("private", {
          message: "The username already exists"
        });
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
          res.render("private", {
            message: "Something went wrong"
          });
        } else {
          res.redirect("/private-page");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});

//Delete User

router.post('/private-page/:id/delete', (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(res.redirect('/private-page'))
    .catch(res.redirect('/private-page', {
      message: `There was an error trying to delete the User`
    }));
});


//Log out
router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;