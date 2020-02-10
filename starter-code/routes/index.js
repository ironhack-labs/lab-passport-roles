const express = require("express");
const router = express.Router();

// Require user model
const User = require("../models/User")
const Course = require("../models/Course")

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport 
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.post("/", passport.authenticate("local", {
//   successRedirect: "/private",
//   failureRedirect: "/",
//   failureFlash: true,
//   passReqToCallback: true
// }));

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}
const checkDev = checkRoles('Developer');
const checkTA = checkRoles('TA');
const checkBoss = checkRoles('Boss');

if (checkBoss) {
  router.post("/", passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  }));
  router.get('/private', checkBoss, (req, res, next) => {
    User.find()
      .then((allUser) => {
        res.render('private', { User: allUser })
      }).catch((err) => {
        console.log("espabilaaa")
      })
  })
} else if (checkTA) {
  router.post("/", passport.authenticate("local", {
    successRedirect: "/privateTA",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  }));
  router.get('/privateTA', checkTA, (req, res, next) => {
    User.find()
      .then((allUser) => {
        res.render('privateTA', { User: allUser })
      }).catch((err) => {
        console.log("espabilaaa")
      })
  })
}

router.get('/user/:id/edit', (req, res, next) => {
  User.findById(req.params.id).then(oneUser => {
    res.render('userEdit', oneUser)
  });
});

router.post('/user/:id', (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body })
    .then(() => res.redirect('/private'))
    .catch(err => console.log(err))
});

router.get('/addUser', checkRoles('Boss'), (req, res) => {
  res.render('newUser', { user: req.user });
});



router.post('/addUser', checkRoles('Boss'), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  if (username === "" || password === "" || role === "") {
    res.render("newUser", { message: "Indicate username and password" });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("newUser", { message: "The username already exists" });
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
          res.render("newUser", { message: "Something went wrong" });
        } else {
          res.redirect("/private");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});

router.post('/user/:id/delete', (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/private'))
    .catch(err => console.log(err))
});

router.get('/addCourse', checkRoles('TA'), (req, res) => {
  res.render('newCourse', { user: req.user });
});

router.post('/addCourse', (req, res, next) => {
  Course.create(req.body)
    .then(() => res.redirect('/privateTA'))
    .catch(err => console.log(err))
});

module.exports = router;
